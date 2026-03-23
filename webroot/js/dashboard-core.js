// Dashboard Core - Panel Cycling Engine

/**
 * PanelCycler - Core cycling system for dashboard panels
 * Handles automatic rotation through multiple slides with fade transitions
 */
class PanelCycler {
  constructor(panelSelector, slides, slideLength, options = {}) {
    this.panelSelector = panelSelector;
    this.panel = $(panelSelector);
    this.contentDiv = this.panel.find('.panel-content');
    this.slides = slides;           // Array of slide render functions
    this.slideLength = slideLength; // Display time in ms
    this.currentIndex = 0;
    this.isRunning = false;
    this.nextTimeout = null;
    this.isTransitioning = false;

    // Options
    this.transitionSpeed = options.transitionSpeed || 500;
    this.onSlideChange = options.onSlideChange || null;
    this.debug = options.debug || false;

    if (this.debug) {
      console.log(`[PanelCycler] Created for ${panelSelector} with ${slides.length} slides`);
    }
  }

  /**
   * Start cycling through slides
   */
  start() {
    if (this.isRunning) {
      console.warn(`[PanelCycler] Already running for ${this.panelSelector}`);
      return;
    }

    if (this.slides.length === 0) {
      console.warn(`[PanelCycler] No slides to display for ${this.panelSelector}`);
      return;
    }

    if (this.debug) {
      console.log(`[PanelCycler] Starting ${this.panelSelector}`);
    }

    this.isRunning = true;
    this.currentIndex = 0;
    this.showSlide(0);

    if (this.slides.length > 1) {
      this.scheduleNext();
    }
  }

  /**
   * Stop cycling
   */
  stop() {
    if (this.debug) {
      console.log(`[PanelCycler] Stopping ${this.panelSelector}`);
    }

    this.isRunning = false;

    if (this.nextTimeout) {
      clearTimeout(this.nextTimeout);
      this.nextTimeout = null;
    }
  }

  /**
   * Show a specific slide with transition
   */
  showSlide(index) {
    if (index < 0 || index >= this.slides.length) {
      console.error(`[PanelCycler] Invalid slide index: ${index}`);
      return;
    }

    if (this.debug) {
      console.log(`[PanelCycler] Showing slide ${index} for ${this.panelSelector}`);
    }

    if (this.isTransitioning) {
      this.contentDiv.stop(true, true);
      this.isTransitioning = false;
    }

    // Fade out, render, fade in
    this.fadeOut(() => {
      try {
        // Call the render function for this slide
        this.slides[index]();

        // Callback for slide change
        if (this.onSlideChange) {
          this.onSlideChange(index, this.slides.length);
        }
      } catch (error) {
        console.error(`[PanelCycler] Error rendering slide ${index}:`, error);
        // Don't skip immediately — let scheduleNext handle the transition normally
      }

      this.fadeIn();
    });
  }

  /**
   * Schedule the next slide transition.
   * If the current slide is a function with a .duration property, that overrides slideLength.
   */
  scheduleNext() {
    if (!this.isRunning) return;

    const currentSlide = this.slides[this.currentIndex];
    const duration = (currentSlide && currentSlide.duration) ? currentSlide.duration : this.slideLength;

    this.nextTimeout = setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      this.showSlide(this.currentIndex);

      if (this.isRunning && this.slides.length > 1) {
        this.scheduleNext();
      }
    }, duration);
  }

  /**
   * Fade out the panel content
   */
  fadeOut(callback) {
    this.isTransitioning = true;
    this.contentDiv.stop(true, true);
    this.contentDiv.addClass('transitioning-out');
    this.contentDiv.fadeOut(this.transitionSpeed, () => {
      this.contentDiv.removeClass('transitioning-out');
      if (callback) callback();
    });
  }

  /**
   * Fade in the panel content
   */
  fadeIn() {
    this.contentDiv.stop(true, true);
    this.contentDiv.addClass('transitioning-in');
    this.contentDiv.fadeIn(this.transitionSpeed, () => {
      this.contentDiv.removeClass('transitioning-in');
      this.isTransitioning = false;
    });
  }

  /**
   * Refresh the currently displayed slide without interrupting the cycle
   */
  refreshCurrentSlide() {
    if (this.slides.length === 0 || this.isTransitioning) return;

    try {
      // Re-render current slide without fade transition
      this.slides[this.currentIndex]();

      if (this.debug) {
        console.log(`[PanelCycler] Refreshed slide ${this.currentIndex} for ${this.panelSelector}`);
      }
    } catch (error) {
      console.error(`[PanelCycler] Error refreshing slide:`, error);
    }
  }

  /**
   * Jump to a specific slide
   */
  goToSlide(index) {
    if (index < 0 || index >= this.slides.length) {
      console.error(`[PanelCycler] Invalid slide index: ${index}`);
      return;
    }

    // Cancel scheduled transition
    if (this.nextTimeout) {
      clearTimeout(this.nextTimeout);
      this.nextTimeout = null;
    }

    this.currentIndex = index;
    this.showSlide(index);

    // Resume cycling if running
    if (this.isRunning && this.slides.length > 1) {
      this.scheduleNext();
    }
  }

  /**
   * Update the slides array without resetting position.
   * The current slide index is preserved (clamped if the new array is shorter).
   * The current slide is re-rendered with fresh data and the cycle timer is
   * restarted from the current position — no jump back to slide 0.
   */
  updateSlides(newSlides) {
    if (!Array.isArray(newSlides) || newSlides.length === 0) {
      console.warn(`[PanelCycler] Invalid slides array provided`);
      return;
    }

    const wasRunning = this.isRunning;
    this.contentDiv.stop(true, true);
    this.isTransitioning = false;
    if (wasRunning) this.stop();

    this.slides = newSlides;

    // Clamp to valid range but don't force back to 0
    if (this.currentIndex >= newSlides.length) {
      this.currentIndex = 0;
    }

    if (wasRunning) {
      this.isRunning = true;
      // Re-render the current slide with the new data
      try {
        this.slides[this.currentIndex]();
      } catch (error) {
        console.error(`[PanelCycler] Error re-rendering slide ${this.currentIndex}:`, error);
      }
      // Resume cycle timer from current position (no fade interruption)
      if (this.slides.length > 1) {
        this.scheduleNext();
      }
    }

    if (this.debug) {
      console.log(`[PanelCycler] Updated to ${newSlides.length} slides, resuming at index ${this.currentIndex} for ${this.panelSelector}`);
    }
  }

  /**
   * Get current slide info
   */
  getCurrentSlide() {
    return {
      index: this.currentIndex,
      total: this.slides.length,
      isRunning: this.isRunning
    };
  }
}

/**
 * Helper function to filter slides based on data availability
 * @param {Array} slideDefinitions - Array of {name, renderFn, hasDataFn}
 * @returns {Array} - Filtered array of render functions
 */
function filterSlidesByData(slideDefinitions) {
  return slideDefinitions
    .filter(slide => {
      if (!slide.hasDataFn) return true; // Include if no check function
      try {
        return slide.hasDataFn();
      } catch (error) {
        console.warn(`Error checking data for slide ${slide.name}:`, error);
        return false;
      }
    })
    .map(slide => slide.renderFn);
}

/**
 * Create a placeholder slide renderer
 */
function createPlaceholderSlide(message, containerSelector) {
  return function() {
    $(containerSelector).html(`
      <div style="text-align: center; padding: 60px 20px; font-size: 20px; color: rgba(255,255,255,0.7);">
        ${message}
      </div>
    `);
  };
}

/**
 * Stagger the start of multiple cyclers
 * @param {Array} cyclers - Array of PanelCycler instances
 * @param {Number} delay - Delay in ms between each start
 */
function staggeredStart(cyclers, delay = 500) {
  cyclers.forEach((cycler, index) => {
    setTimeout(() => {
      cycler.start();
    }, index * delay);
  });
}
