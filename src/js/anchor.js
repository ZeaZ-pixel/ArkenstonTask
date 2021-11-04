const anthor = () => {
const anchors = document.querySelectorAll('.nav__link')

anchors.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault()
    const id = item.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});
}

export default anthor;
