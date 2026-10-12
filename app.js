const navItems = ['Inicio', 'Servicios', 'Reservar cita', 'Nuestro equipo', 'Contacto'];

const benefits = [
  {
    icon: React.createElement(
      'svg',
      { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
      React.createElement('path', {
        d: 'M7 2v3M17 2v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
      })
    ),
    text: 'Agenda fácil y rápida',
  },
  {
    icon: React.createElement(
      'svg',
      { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
      React.createElement('path', {
        d: 'M12 22s7-4.5 7-11a7 7 0 0 0-14 0c0 6.5 7 11 7 11Z' }),
      React.createElement('path', { d: 'M12 22V9M8.5 13.5 12 17l3.5-3.5M8 9h8' })
    ),
    text: 'Profesionales a tu servicio',
  },
  {
    icon: React.createElement(
      'svg',
      { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
      React.createElement('path', {
        d: 'M20.8 5.7a5.4 5.4 0 0 0-7.6 0L12 6.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 22l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z',
      })
    ),
    text: 'Tu bienestar es nuestra prioridad',
  },
];

const serviceCategories = [
  { id: 'todos', name: 'Todos' },
  { id: 'peluqueria', name: 'Peluquería' },
  { id: 'unas', name: 'Uñas' },
  { id: 'otro', name: 'Otros' },
];

const serviceCatalog = [
  { id: 1, name: 'Manicure', category: 'unas', duration: 45 },
  { id: 2, name: 'Pedicure', category: 'unas', duration: 60 },
  { id: 3, name: 'Manicure y pedicure', category: 'unas', duration: 90 },
  { id: 4, name: 'Corte de cabello', category: 'peluqueria', duration: 45 },
  { id: 5, name: 'Cepillado', category: 'peluqueria', duration: 45 },
  { id: 6, name: 'Tinte', category: 'peluqueria', duration: 120 },
];

const professionals = [
  { id: 1, name: 'Yise', specialty: 'Uñas', serviceIds: [1, 2, 3] },
  { id: 2, name: 'Yisela', specialty: 'Uñas', serviceIds: [1, 2, 3] },
  { id: 3, name: 'Sofia', specialty: 'Peluquería', serviceIds: [4, 5, 6] },
];

const demoTimeSlots = ['9:00 a. m.', '10:00 a. m.', '11:30 a. m.', '1:00 p. m.', '2:30 p. m.', '4:00 p. m.'];

function formatDate(date, options) {
  return new Intl.DateTimeFormat('es-CO', options).format(date);
}

function buildAvailableDates() {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let offset = 1; offset <= 14; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    dates.push(date);
  }

  return dates;
}

function crownIcon(className) {
  return React.createElement(
    'svg',
    { className, viewBox: '0 0 120 72', 'aria-hidden': 'true' },
    React.createElement('path', {
      d: 'M18 54h84l-8-34-23 20-11-29-13 29-21-20-8 34Z',
    }),
    React.createElement('path', { d: 'M26 61h68M30 54h60' }),
    React.createElement('circle', { cx: '24', cy: '18', r: '5' }),
    React.createElement('circle', { cx: '60', cy: '8', r: '5' }),
    React.createElement('circle', { cx: '96', cy: '18', r: '5' })
  );
}

function userIcon() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
    React.createElement('path', { d: 'M20 21a8 8 0 0 0-16 0' }),
    React.createElement('circle', { cx: '12', cy: '7', r: '4' })
  );
}

function arrowIcon(className = 'arrow-icon') {
  return React.createElement(
    'svg',
    { className, viewBox: '0 0 24 24', 'aria-hidden': 'true' },
    React.createElement('path', { d: 'M5 12h14M13 6l6 6-6 6' })
  );
}

function scissorsIcon() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
    React.createElement('circle', { cx: '6', cy: '18', r: '3' }),
    React.createElement('circle', { cx: '6', cy: '6', r: '3' }),
    React.createElement('path', { d: 'M8.6 8.6 19 19M8.6 15.4 19 5' })
  );
}

function polishIcon() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
    React.createElement('path', { d: 'M9 2h6v5H9zM8 7h8l1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L8 7Z' }),
    React.createElement('path', { d: 'M10 11h4' })
  );
}

function lotusIcon() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
    React.createElement('path', { d: 'M12 21s-5-3.5-5-8a5 5 0 0 1 5-5 5 5 0 0 1 5 5c0 4.5-5 8-5 8Z' }),
    React.createElement('path', { d: 'M12 21s-8-.5-9-7c4-.5 7 1 9 7ZM12 21s8-.5 9-7c-4-.5-7 1-9 7ZM12 8s-2-3-6-4c0 4 2 7 6 9M12 8s2-3 6-4c0 4-2 7-6 9' })
  );
}

function sparkleIcon() {
  return React.createElement(
    'svg',
    { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
    React.createElement('path', { d: 'M12 3 9.8 8.8 4 11l5.8 2.2L12 19l2.2-5.8L20 11l-5.8-2.2L12 3ZM19 17l-.9 2.1L16 20l2.1.9L19 23l.9-2.1L22 20l-2.1-.9L19 17ZM5 2l-.8 2.2L2 5l2.2.8L5 8l.8-2.2L8 5l-2.2-.8L5 2Z' })
  );
}

function BrandLogo({ variant = 'header' }) {
  return React.createElement(
    'div',
    { className: `logo-mark logo-mark-${variant}`, 'aria-label': 'Samantha Beauty Center' },
    React.createElement('span', { className: 'logo-brush' }),
    React.createElement('span', { className: 'logo-name' }, 'Samantha'),
    React.createElement('span', { className: 'logo-sub' }, 'Beauty Center')
  );
}

function App() {
  const [category, setCategory] = React.useState('todos');
  const [search, setSearch] = React.useState('');
  const [selectedService, setSelectedService] = React.useState(null);
  const [selectedProfessional, setSelectedProfessional] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState('');
  const [selectedTime, setSelectedTime] = React.useState('');
  const [bookingStep, setBookingStep] = React.useState(1);
  const [bookingSummary, setBookingSummary] = React.useState(null);

  const availableDates = React.useMemo(buildAvailableDates, []);
  const filteredServices = serviceCatalog.filter((service) => {
    const matchesCategory = category === 'todos' || service.category === category;
    const matchesSearch = service.name.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es'));
    return matchesCategory && matchesSearch;
  });
  const matchingProfessionals = selectedService
    ? professionals.filter((professional) => professional.serviceIds.includes(selectedService.id))
    : [];

  function chooseService(service) {
    setSelectedService(service);
    setSelectedProfessional(null);
    setSelectedDate('');
    setSelectedTime('');
    setBookingSummary(null);
    setBookingStep(2);
  }

  function chooseProfessional(professional) {
    setSelectedProfessional(professional);
    setSelectedDate('');
    setSelectedTime('');
    setBookingStep(2);
  }

  function handleBookingSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setBookingSummary({
      name: formData.get('name').trim(),
      phone: formData.get('phone').trim(),
      email: formData.get('email').trim(),
    });
    setBookingStep(4);
  }

  function resetBooking() {
    setSelectedService(null);
    setSelectedProfessional(null);
    setSelectedDate('');
    setSelectedTime('');
    setBookingSummary(null);
    setBookingStep(1);
  }

  return React.createElement(
    'div',
    { className: 'page-shell' },
    React.createElement(
      'header',
      { className: 'top-bar' },
      React.createElement('a', { href: '#inicio', className: 'brand' }, React.createElement(BrandLogo)),
      React.createElement(
        'nav',
        { className: 'main-nav', 'aria-label': 'Navegación principal' },
        navItems.map((item, index) =>
          React.createElement(
            'a',
            {
              key: item,
              href: ['#inicio', '#servicios', '#reservar', '#equipo', '#contacto'][index],
              className: index === 0 ? 'active' : '',
            },
            item
          )
        )
      ),
      React.createElement(
        'a',
        { className: 'login-btn', href: '#reservar' },
        userIcon(),
        React.createElement('span', null, 'Reservar cita')
      )
    ),
    React.createElement(
      'main',
      { id: 'inicio', className: 'hero' },
      React.createElement('span', { className: 'leaf-line leaf-left', 'aria-hidden': 'true' }),
      React.createElement(
        'section',
        { className: 'hero-copy' },
        React.createElement('p', { className: 'eyebrow' }, 'Belleza  ·  Cuidado  ·  Confianza'),
        React.createElement(
          'h1',
          null,
          'Tu belleza,',
          React.createElement('span', null, 'en buenas manos')
        ),
        React.createElement(
          'p',
          { className: 'lead' },
          'Encuentra el servicio ideal, elige quién te atiende y reserva el horario que mejor se adapte a ti.'
        ),
        React.createElement(
          'div',
          { className: 'cta-row' },
          React.createElement(
            'a',
            { className: 'btn btn-primary', href: '#reservar' },
            'Reservar cita',
            arrowIcon()
          ),
          React.createElement('a', { className: 'btn btn-secondary', href: '#servicios' }, 'Conoce nuestros servicios')
        ),
        React.createElement(
          'div',
          { className: 'benefits', 'aria-label': 'Beneficios' },
          benefits.map((item) =>
            React.createElement(
              'div',
              { className: 'benefit-item', key: item.text },
              React.createElement('span', { className: 'icon-badge' }, item.icon),
              React.createElement('span', null, item.text)
            )
          )
        )
      ),
      React.createElement(
        'section',
        { className: 'hero-visual', 'aria-label': 'Recepción del salón de belleza' },
        React.createElement(
          'div',
          { className: 'studio-scene' },
          React.createElement('div', { className: 'wall-panel' }),
          React.createElement('div', { className: 'reception-desk' }),
          React.createElement('div', { className: 'salon-chair salon-chair-one' }),
          React.createElement('div', { className: 'salon-chair salon-chair-two' }),
          React.createElement('div', { className: 'mirror mirror-one' }),
          React.createElement('div', { className: 'mirror mirror-two' }),
          React.createElement('div', { className: 'pendant pendant-one' }),
          React.createElement('div', { className: 'pendant pendant-two' }),
          React.createElement('div', { className: 'flower-vase' }),
          React.createElement('div', { className: 'wall-sign' }, React.createElement(BrandLogo, { variant: 'wall' }))
        ),
        React.createElement(
          'div',
          { className: 'floating-note' },
          React.createElement(
            'p',
            null,
            'Más que',
            React.createElement('br', null),
            React.createElement('span', null, 'belleza,'),
            React.createElement('br', null),
            'confianza'
          ),
          React.createElement('span', { className: 'heart', 'aria-hidden': 'true' }, '♡')
        )
      )
    ),
    React.createElement(
      'section',
      { className: 'booking-section', id: 'reservar' },
      React.createElement(
        'div',
        { className: 'booking-heading', id: 'servicios' },
        React.createElement('p', { className: 'eyebrow' }, 'Reserva en pocos pasos'),
        React.createElement('h2', null, 'Agenda tu próxima cita'),
        React.createElement(
          'p',
          null,
          'Elige tu servicio, profesional, fecha y horario para preparar tu solicitud.'
        )
      ),
      React.createElement(
        'div',
        { className: 'demo-notice', role: 'status' },
        React.createElement('strong', null, 'Personal y servicios: '),
        'se muestran los registros activos revisados en la base local; esta página aún no consulta la base en tiempo real. Los horarios son de demostración y las reservas aún no se guardan.'
      ),
      React.createElement(
        'ol',
        { className: 'booking-steps', 'aria-label': 'Pasos de reserva' },
        [
          ['1', 'Servicio'],
          ['2', 'Profesional y horario'],
          ['3', 'Tus datos'],
          ['4', 'Resumen'],
        ].map(([number, label], index) =>
          React.createElement(
            'li',
            {
              key: number,
              className: bookingStep === index + 1 ? 'current' : bookingStep > index + 1 ? 'complete' : '',
            },
            React.createElement('span', null, number),
            React.createElement('strong', null, label)
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'booking-panel' },
        bookingStep === 1 &&
          React.createElement(
            'section',
            { 'aria-labelledby': 'service-step-title' },
            React.createElement('div', { className: 'step-heading' },
              React.createElement('span', { className: 'step-kicker' }, 'Paso 1'),
              React.createElement('h3', { id: 'service-step-title' }, '¿Qué servicio deseas reservar?')
            ),
            React.createElement(
              'label',
              { className: 'service-search' },
              React.createElement('span', { className: 'sr-only' }, 'Buscar servicio por nombre'),
              React.createElement('input', {
                type: 'search',
                value: search,
                onChange: (event) => setSearch(event.target.value),
                placeholder: 'Buscar servicio por nombre',
              })
            ),
            React.createElement(
              'div',
              { className: 'category-list', role: 'group', 'aria-label': 'Filtrar por categoría' },
              serviceCategories.map((item) =>
                React.createElement(
                  'button',
                  {
                    key: item.id,
                    type: 'button',
                    className: category === item.id ? 'category-chip selected' : 'category-chip',
                    onClick: () => setCategory(item.id),
                    'aria-pressed': category === item.id,
                  },
                  item.name
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'booking-service-grid' },
              filteredServices.length
                ? filteredServices.map((service) =>
                    React.createElement(
                      'button',
                      {
                        key: service.id,
                        className: 'booking-service-card',
                        type: 'button',
                        onClick: () => chooseService(service),
                      },
                      React.createElement('span', { className: 'service-card-icon' }, service.category === 'Cabello' ? scissorsIcon() : service.category === 'Uñas' ? polishIcon() : lotusIcon()),
                      React.createElement('span', { className: 'booking-service-copy' },
                        React.createElement('strong', null, service.name),
                        React.createElement('small', null, serviceCategories.find((item) => item.id === service.category).name)
                      ),
                      React.createElement('span', { className: 'service-meta' },
                        React.createElement('span', null, `${service.duration} min`),
                        React.createElement('span', null, 'Precio por confirmar')
                      ),
                      arrowIcon('booking-arrow')
                    )
                  )
                : React.createElement('p', { className: 'empty-message' }, 'No encontramos servicios con ese nombre.')
            )
          ),
        bookingStep === 2 &&
          selectedService &&
          React.createElement(
            'section',
            { 'aria-labelledby': 'professional-step-title' },
            React.createElement(
              'div',
              { className: 'selected-service-banner' },
              React.createElement('div', null,
                React.createElement('small', null, 'Reservando servicio'),
                React.createElement('strong', null, selectedService.name),
                React.createElement('span', null, `Duración estimada: ${selectedService.duration} minutos`)
              ),
              React.createElement('button', {
                type: 'button',
                className: 'text-button',
                onClick: () => setBookingStep(1),
              }, 'Cambiar')
            ),
            React.createElement('div', { className: 'step-heading' },
              React.createElement('span', { className: 'step-kicker' }, 'Paso 2'),
              React.createElement('h3', { id: 'professional-step-title' }, 'Elige quién te atenderá')
            ),
            React.createElement(
              'div',
              { className: 'professional-list' },
              matchingProfessionals.length
                ? matchingProfessionals.map((professional) =>
                    React.createElement(
                      'button',
                      {
                        key: professional.id,
                        type: 'button',
                        className: selectedProfessional && selectedProfessional.id === professional.id ? 'professional-card selected' : 'professional-card',
                        onClick: () => chooseProfessional(professional),
                        'aria-pressed': Boolean(selectedProfessional && selectedProfessional.id === professional.id),
                      },
                      React.createElement('span', { className: 'professional-avatar' }, userIcon()),
                      React.createElement('span', null,
                        React.createElement('strong', null, professional.name),
                        React.createElement('small', null, professional.specialty)
                      ),
                      selectedProfessional && selectedProfessional.id === professional.id && React.createElement('span', { className: 'selected-check', 'aria-label': 'Seleccionado' }, '✓')
                    )
                  )
                : React.createElement('p', { className: 'empty-message' }, 'No hay profesionales activos asociados a este servicio.')
            ),
            selectedProfessional &&
              React.createElement(
                'div',
                { className: 'availability-panel' },
                React.createElement('div', { className: 'step-heading' },
                  React.createElement('span', { className: 'step-kicker' }, 'Selecciona fecha y hora'),
                  React.createElement('h3', null, 'Próximos días disponibles')
                ),
                React.createElement(
                  'div',
                  { className: 'date-list', 'aria-label': 'Fechas disponibles de demostración' },
                  availableDates.map((date) => {
                    const dateKey = date.toISOString().slice(0, 10);
                    const selected = selectedDate === dateKey;
                    return React.createElement(
                      'button',
                      {
                        key: dateKey,
                        type: 'button',
                        className: selected ? 'date-card selected' : 'date-card',
                        onClick: () => {
                          setSelectedDate(dateKey);
                          setSelectedTime('');
                        },
                        'aria-pressed': selected,
                      },
                      React.createElement('small', null, formatDate(date, { weekday: 'short' })),
                      React.createElement('strong', null, formatDate(date, { day: 'numeric' })),
                      React.createElement('small', null, formatDate(date, { month: 'short' }))
                    );
                  })
                ),
                selectedDate &&
                  React.createElement(
                    'div',
                    { className: 'time-selection' },
                    React.createElement('h4', null, 'Horarios de muestra'),
                    React.createElement(
                      'div',
                      { className: 'time-list' },
                      demoTimeSlots.map((time) =>
                        React.createElement(
                          'button',
                          {
                            key: time,
                            type: 'button',
                            className: selectedTime === time ? 'time-chip selected' : 'time-chip',
                            onClick: () => setSelectedTime(time),
                            'aria-pressed': selectedTime === time,
                          },
                          time
                        )
                      )
                    ),
                    React.createElement(
                      'button',
                      {
                        type: 'button',
                        className: 'btn btn-primary booking-next',
                        disabled: !selectedTime,
                        onClick: () => setBookingStep(3),
                      },
                      'Continuar',
                      arrowIcon()
                    )
                  )
              )
          ),
        bookingStep === 3 &&
          selectedService &&
          selectedProfessional &&
          React.createElement(
            'form',
            { className: 'booking-form', onSubmit: handleBookingSubmit },
            React.createElement(
              'div',
              { className: 'selected-service-banner' },
              React.createElement('div', null,
                React.createElement('small', null, 'Tu cita de demostración'),
                React.createElement('strong', null, selectedService.name),
                React.createElement('span', null, `${selectedProfessional.name} · ${formatDate(new Date(`${selectedDate}T12:00:00`), { weekday: 'long', day: 'numeric', month: 'long' })} · ${selectedTime}`)
              ),
              React.createElement('button', {
                type: 'button',
                className: 'text-button',
                onClick: () => setBookingStep(2),
              }, 'Cambiar')
            ),
            React.createElement('div', { className: 'step-heading' },
              React.createElement('span', { className: 'step-kicker' }, 'Paso 3'),
              React.createElement('h3', null, 'Déjanos tus datos de contacto')
            ),
            React.createElement('div', { className: 'form-grid' },
              React.createElement('label', { className: 'form-field' },
                React.createElement('span', null, 'Nombre completo'),
                React.createElement('input', { name: 'name', type: 'text', autoComplete: 'name', required: true, maxLength: 120, placeholder: 'Tu nombre' })
              ),
              React.createElement('label', { className: 'form-field' },
                React.createElement('span', null, 'Teléfono'),
                React.createElement('input', { name: 'phone', type: 'tel', autoComplete: 'tel', required: true, maxLength: 30, placeholder: 'Tu número de contacto' })
              ),
              React.createElement('label', { className: 'form-field form-field-wide' },
                React.createElement('span', null, 'Correo electrónico (opcional)'),
                React.createElement('input', { name: 'email', type: 'email', autoComplete: 'email', maxLength: 254, placeholder: 'tucorreo@ejemplo.com' })
              )
            ),
            React.createElement('p', { className: 'privacy-note' }, 'En esta demostración, los datos solo se usan para mostrar el resumen y no se envían ni guardan.'),
            React.createElement(
              'div',
              { className: 'form-actions' },
              React.createElement('button', { type: 'button', className: 'btn btn-secondary', onClick: () => setBookingStep(2) }, 'Volver'),
              React.createElement('button', { type: 'submit', className: 'btn btn-primary' }, 'Ver resumen', arrowIcon())
            )
          ),
        bookingStep === 4 &&
          bookingSummary &&
          selectedService &&
          selectedProfessional &&
          React.createElement(
            'section',
            { className: 'booking-confirmation', 'aria-live': 'polite' },
            React.createElement('span', { className: 'confirmation-icon', 'aria-hidden': 'true' }, '✓'),
            React.createElement('span', { className: 'step-kicker' }, 'Paso 4 · Resumen de demostración'),
            React.createElement('h3', null, 'Tu solicitud está lista para revisar'),
            React.createElement('p', null, 'Esto es solo una vista previa. La cita no se ha confirmado ni guardado.'),
            React.createElement(
              'dl',
              { className: 'summary-list' },
              [
                ['Servicio', selectedService.name],
                ['Profesional', selectedProfessional.name],
                ['Fecha', formatDate(new Date(`${selectedDate}T12:00:00`), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })],
                ['Hora', selectedTime],
                ['Cliente', bookingSummary.name],
                ['Teléfono', bookingSummary.phone],
                ['Correo', bookingSummary.email || 'No indicado'],
              ].map(([label, value]) =>
                React.createElement('div', { className: 'summary-row', key: label },
                  React.createElement('dt', null, label),
                  React.createElement('dd', null, value)
                )
              )
            ),
            React.createElement('button', { type: 'button', className: 'btn btn-primary', onClick: resetBooking }, 'Empezar otra reserva')
          )
      )
    ),
    React.createElement(
      'section',
      { className: 'team-section', id: 'equipo' },
      React.createElement('p', { className: 'eyebrow' }, 'Un espacio para ti'),
      React.createElement('h2', null, 'Nuestro equipo te espera'),
      React.createElement('p', null, 'El equipo y los servicios mostrados corresponden a los registros activos revisados en la base local. La página aún no se conecta a la base en tiempo real.')
    ),
    React.createElement(
      'footer',
      { className: 'footer-tag', id: 'contacto' },
      React.createElement('span', null),
      React.createElement('strong', null, '♛'),
      React.createElement('p', null, 'Belleza hoy, confianza siempre'),
      React.createElement('span', null)
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
