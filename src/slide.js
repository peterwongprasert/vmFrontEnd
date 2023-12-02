function connectSlides(initialPage){
  console.log('slide')

  let page = initialPage;

  const nextButtons = document.getElementsByClassName('next');

  for (const button of nextButtons) {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('clicked');
      scrollBy100vw(page);
      page++;
    });
  }
}

function scrollBy100vw(page) {
  console.log(page)
  let thisClass = '.page' + page;
  const pageWidth = document.querySelector(thisClass).offsetWidth;
  console.log(pageWidth)
  const currentScrollLeft = document.documentElement.scrollLeft;
  const targetScrollLeft = currentScrollLeft + pageWidth;

  document.documentElement.scrollTo({
    left: targetScrollLeft,
    behavior: 'smooth',
  });
}

function scrollPrev(page) {

  let thisClass = '.page' + page
  const pageWidth = document.querySelector(thisClass).offsetWidth;
  const currentScrollLeft = document.documentElement.scrollLeft;
  const targetScrollLeft = currentScrollLeft - pageWidth;

  document.documentElement.scrollTo({
    left: targetScrollLeft,
    behavior: 'smooth',
  });
  
}

module.exports = {
  connectSlides
};