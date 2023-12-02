function connectSlides(page){
  console.log('slide')
  document.getElementById('login').addEventListener('click', ()=>{
    console.log('click')
    scrollBy100vw(page);
  })
}

function scrollBy100vw(page) {
  let thisClass = '.page' + page;
  const pageWidth = document.querySelector(thisClass).offsetWidth;
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