function createElement(tagName, options) {
	const element = document.createElement(tagName);
  
  if (options.appendTo) {
  	if (typeof options.appendTo === 'string') {
      options.appendTo = ge(options.appendTo);
    }

    options.appendTo.append(element);
  }
  
  if (options.attrs) {
  	const elAttrs = options.attrs;
    
  	for (const key in elAttrs) {
  		let name = key;
  		const value = elAttrs[key];
      if (name === "className") {
       name = "class";
      }
  
  	element.setAttribute(name, value);
    }
  }

  if (options.content) {
    if (!Array.isArray(options.content)) {
      options.content = [options.content];
    }

    options.content.forEach(child => element.append(child));
  }
  
  if (options.events) {
    const elEvents = options.events;
        
		for (const key in elEvents) {
    	const eventType = key;
      const listener = elEvents[key];
      
  	element.addEventListener(eventType, listener);
   }
  }
   return element;
}

function Slider(options) {
	this.container = document.querySelector(options.container);
  this.imageUrls = options.imageUrls;
  this.direction = options.direction;
  this.duration = options.duration;
  
  this.currentIndex = 0;

  this.createElements();
  this.slideTo(0);
  this.play();

  this.container.addEventListener("mouseover", () => this.pause());
  this.container.addEventListener("mouseout", () => this.play());
}

Slider.prototype.createElements = function () {
	const sliderEl = createElement('div', {
  	appendTo: this.container,
  	attrs: { className: 'slider' }
  });
  
  const sliderControlsEl = createElement('div', {
  	appendTo: sliderEl,
  	attrs: { className: 'slider-controls' }
  });
  
  const buttonLeftEl = createElement('button', {
  	appendTo: sliderControlsEl,
    attrs: { className: 'slider-control left' },
    content: createElement('i', { attrs: { className: 'fas fa-angle-left' } }),
    events: {
    	click: () => this.slideLeft(),
    }
  });
  
  const buttonRightEl = createElement('button', {
  	appendTo: sliderControlsEl,
    attrs: { className: 'slider-control right' },
    content: createElement('i', { attrs: { className: 'fas fa-angle-right' } }),
    events: {
    	click: () => this.slideRight(),
    }
  });
  
	  this.pointsEls = this.imageUrls.map((url, index) => createElement('span', { attrs: { className: 'slider-point' } }));
    
    this.pointsEls.forEach((pointEl, index) => {
  		pointEl.addEventListener('click', () => this.slideTo(index));
});

  const sliderPointsEl = createElement('div', {
  	appendTo: sliderControlsEl,
  	attrs: { className: 'slider-points' },
    content: this.pointsEls,
  });
  
	this.imagesEls = this.imageUrls.map(url => createElement('img', {attrs: { src: url }} ));

  const slideImgs = createElement('div', {
  	appendTo: sliderEl,
  	attrs: { className: 'slider-images' },
    content: this.imagesEls,
  });
  
};

Slider.prototype.play = function () {
  if (this.intervalID) {
    return;
  }

  this.intervalID = setInterval(() => {
  	if (this.direction === 'left') {
    	this.slideLeft();
    } else {
    	this.slideRight();
    }
  }, this.duration);
};

Slider.prototype.pause = function () {
  clearInterval(this.intervalID);
  this.intervalID = null;
};

Slider.prototype.slideLeft = function () {
  let slideIndex = this.currentIndex;
  slideIndex--;
  
  if (slideIndex < 0) {
  slideIndex = this.imageUrls.length - 1;
  }
  
  this.slideTo(slideIndex);
};

Slider.prototype.slideRight = function () {
  let slideIndex = this.currentIndex;
	slideIndex++;
  
  if (slideIndex === this.imageUrls.length) {
  slideIndex = 0;
  }
  
  this.slideTo(slideIndex);
};

Slider.prototype.slideTo = function (slideIndex) {
	this.currentIndex = slideIndex;
  
	this.imagesEls.forEach(el => el.classList.remove('active'));
  this.imagesEls[slideIndex].classList.add('active');

  this.pointsEls.forEach(el => el.classList.remove('active'));
  this.pointsEls[slideIndex].classList.add('active');
};

const imageUrls = [
  'https://media.familyminded.com/3b/0d/3b0d80ed89394877a47899a513ca04bd.jpeg',
  'https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2016/11/29092111/AdobeStock_94435211-800x600.jpeg',
  'https://media.familyminded.com/ce/39/ce39903185b44964b9db839467e92260.jpg',
];

const slider1 = new Slider({
	container: '#slider2',
	imageUrls: imageUrls,
  duration: 3000,
  direction: 'left',
});

const slider2 = new Slider({
	container: '#slider1',
	imageUrls: imageUrls,
  duration: 4000,
});