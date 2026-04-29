    const cardsAnimation = document.querySelector('.card-animation');

const onScroll = () => {
  const rect = cardsAnimation?.getBoundingClientRect();
  const triggerPoint = window.innerHeight * 0.8; // 70% de la pantalla

  // Si la tarjeta está dentro del área visible, agregar la clase de animación
  // elementos que tenga la clase se un array
  const cardElements = Array.from(document.querySelectorAll('.card-animation'));

  cardElements.forEach((card) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < triggerPoint) {
      card.classList.add('animate-fade-in-up', 'opacity-100');
      card.classList.remove('opacity-0');
      // delay para que se vea el efecto de animación
      card.style.animationDelay = `${cardElements.indexOf(card) * 0.1}s`;
    } else {
      card.classList.remove('animate-fade-in-up', 'opacity-100');
      card.classList.add('opacity-0');
    }
  });

  
};

window.addEventListener('scroll', onScroll);