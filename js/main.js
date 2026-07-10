/* ==========================================================================
   MAIN JAVASCRIPT - FALCE ADVOCACIA
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Global Config
  const CONFIG = {
    whatsappNumber: '5512996155317', // Lawyer's WhatsApp
    officeEmail: 'lucio@falce.adv.br'
  };

  /* ==========================================================================
     1. NAVBAR EFFECTS & RESPONSIVE TOGGLE
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  const navItems = document.querySelectorAll('.nav-item');

  // Change Navbar layout on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Proactive Active Item Highlighting
    highlightActiveNavItem();
  });

  // Mobile Menu Toggle
  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggleBtn.classList.toggle('active');
      
      // Animate hamburger to X
      const bars = mobileToggleBtn.querySelectorAll('.bar');
      if (mobileToggleBtn.classList.contains('active')) {
        bars[0].style.transform = 'translateY(7px) rotate(45deg)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
    });
  }

  // Close Mobile Menu when clicking a nav item
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggleBtn.classList.remove('active');
        const bars = mobileToggleBtn.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
      
      // Update active nav state
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Highlight Nav Item on Scroll
  function highlightActiveNavItem() {
    const scrollPos = window.scrollY + 200;
    const sections = ['inicio', 'atuacao', 'sobre', 'direitos', 'contato'];
    
    sections.forEach(secId => {
      const el = document.getElementById(secId);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        
        if (scrollPos >= top && scrollPos < top + height) {
          navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${secId}`) {
              item.classList.add('active');
            }
          });
        }
      }
    });
  }

  /* ==========================================================================
     2. BIPARTITE UX TABS (Pessoa Física vs Jurídica)
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-content-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      
      // Toggle Active Tab Buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Toggle Active Content Panes
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.getAttribute('id') === targetId) {
          pane.classList.add('active');
        }
      });
    });
  });

  /* ==================== REMOÇÃO COMPLETA DE MODAIS E CLIQUES DOS CARDS ==================== */
  // Seleciona os botões antigos e os cards
  const openModalButtons = document.querySelectorAll('.btn-read-article');
  const articleCards = document.querySelectorAll('.article-card');

  // Desativa completamente o clique em qualquer botão residual
  openModalButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  // Garante que o clique no card não dispare absolutamente nada
  articleCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });



  /* ==========================================================================
     5. NEW BOOKING SELECTOR ENGINE
     ========================================================================== */
  const dateCards = document.querySelectorAll('.date-card');
  const hourCards = document.querySelectorAll('.hour-card');
  const profileCards = document.querySelectorAll('.profile-card');
  const bookingForm = document.getElementById('labor-booking-form');
  
  let selectedDate = '';
  let selectedHour = '';
  let selectedProfile = '';

  // 1. Monitora Seleção de Data
  dateCards.forEach(card => {
    card.addEventListener('click', () => {
      dateCards.forEach(c => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      selectedDate = card.getAttribute('data-date');
    });
  });

  // 2. Monitora Seleção Direta de Horário
  hourCards.forEach(card => {
    card.addEventListener('click', () => {
      hourCards.forEach(c => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      selectedHour = card.getAttribute('data-hour');
    });
  });

  // 3. Monitora Seleção de Perfil
  profileCards.forEach(card => {
    card.addEventListener('click', () => {
      profileCards.forEach(c => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      selectedProfile = card.getAttribute('data-profile');
    });
  });

  // 4. Envio Estruturado para o WhatsApp da Falce Advocacia
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const clientName = document.getElementById('client-name').value.trim();
      const clientPhone = document.getElementById('client-phone').value.trim();

      if (!selectedDate || !selectedHour || !selectedProfile || !clientName || !clientPhone) {
        alert('Por favor, faça todas as seleções (Data, Horário e Quem Você Representa) antes de enviar.');
        return;
      }

      const whatsappNumber = CONFIG.whatsappNumber; 

      const message = `Olá! Gostaria de solicitar um agendamento de consulta trabalhista:%0A%0A` +
                      `*Nome:* ${encodeURIComponent(clientName)}%0A` +
                      `*Contato:* ${encodeURIComponent(clientPhone)}%0A` +
                      `*Perfil:* ${encodeURIComponent(selectedProfile)}%0A` +
                      `*Data:* ${encodeURIComponent(selectedDate)}%0A` +
                      `*Horário Escolhido:* ${encodeURIComponent(selectedHour)}h`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  /* ==========================================================================
     6. AUTOMATED LEAD-CONVERSION TRIAGE CHATBOT (Falce Assistente)
     ========================================================================== */
  const chatbotContainer = document.getElementById('chatbot-container');
  const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
  const chatMessagesContainer = document.getElementById('chatbot-messages');
  
  // Triage state variables
  let userProfile = '';
  let selectedNicheOption = '';
  let userFullName = '';
  
  // Open / Close Triage Chat Window
  if (chatbotToggleBtn && chatbotWindow) {
    chatbotToggleBtn.addEventListener('click', () => {
      chatbotWindow.classList.toggle('open');
      
      // Clear notification badge
      const badge = chatbotToggleBtn.querySelector('.chatbot-badge-notification');
      if (badge) badge.style.display = 'none';
    });
  }

  if (chatbotCloseBtn && chatbotWindow) {
    chatbotCloseBtn.addEventListener('click', () => {
      chatbotWindow.classList.remove('open');
    });
  }

  // Handle choice selection dynamically
  function handleChatSelection() {
    const optionButtons = document.querySelectorAll('.chat-opt-btn');
    optionButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selectedVal = btn.getAttribute('data-val');
        const nextStep = btn.getAttribute('data-next');
        
        // Hide parent option selectors group to clean flow
        btn.parentElement.style.pointerEvents = 'none';
        btn.parentElement.style.opacity = '0.7';
        
        // Append user response bubble
        appendChatMessage('user', selectedVal);
        
        // Advance chatbot conversation tree
        showBotTyping(() => {
          if (nextStep === 'trabalhador') {
            userProfile = 'Trabalhador';
            askTrabalhadorCase();
          } else if (nextStep === 'empresa') {
            userProfile = 'Empresa';
            askEmpresaCase();
          } else if (nextStep === 'name-request') {
            selectedNicheOption = selectedVal;
            requestUserFullName();
          }
        });
      });
    });
  }

  // Initial trigger for option click listeners
  handleChatSelection();

  // Helper: Append chat bubble
  function appendChatMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.innerHTML = `<div class="msg-bubble">${text}</div>`;
    chatMessagesContainer.appendChild(msgDiv);
    
    // Auto-scroll chatbot frame to bottom
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }

  // Helper: Show dynamic typing dots loader
  function showBotTyping(callback) {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot typing-loader-wrapper';
    typingDiv.innerHTML = `
      <div class="msg-bubble" style="display: flex; gap: 4px; padding: 12px 20px;">
        <span class="typing-dot" style="width:6px;height:6px;background:#94a3b8;border-radius:50%;animation:chatDot 1.4s infinite"></span>
        <span class="typing-dot" style="width:6px;height:6px;background:#94a3b8;border-radius:50%;animation:chatDot 1.4s infinite 0.2s"></span>
        <span class="typing-dot" style="width:6px;height:6px;background:#94a3b8;border-radius:50%;animation:chatDot 1.4s infinite 0.4s"></span>
      </div>
    `;
    chatMessagesContainer.appendChild(typingDiv);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

    // Inject custom animation styles inside DOM dynamically if needed
    if (!document.getElementById('chatbot-typing-keyframes')) {
      const style = document.createElement('style');
      style.id = 'chatbot-typing-keyframes';
      style.innerHTML = `@keyframes chatDot { 0%, 100% { opacity:0.3; transform:translateY(0); } 50% { opacity:1; transform:translateY(-4px); } }`;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      typingDiv.remove();
      callback();
    }, 1200);
  }

  // Bot Tree branch: Worker Question
  function askTrabalhadorCase() {
    const text = `Compreendo perfeitamente. Como trabalhador, qual é o tema principal do seu caso hoje?
      <div class="chat-options-group">
        <button class="chat-opt-btn" data-val="Rescisão Indireta" data-next="name-request">Rescisão Indireta (Sair da empresa)</button>
        <button class="chat-opt-btn" data-val="Horas Extras" data-next="name-request">Horas Extras / Intervalos</button>
        <button class="chat-opt-btn" data-val="Assédio ou Dano Moral" data-next="name-request">Assédio ou Humilhação</button>
        <button class="chat-opt-btn" data-val="Acidente ou Estabilidade" data-next="name-request">Acidente ou Doença de Serviço</button>
        <button class="chat-opt-btn" data-val="Outros Casos Trabalhistas" data-next="name-request">Outras Dúvidas Gerais</button>
      </div>`;
    appendChatMessage('bot', text);
    handleChatSelection();
  }

  // Bot Tree branch: Company Question
  function askEmpresaCase() {
    const text = `Excelente. Oferecemos assessoria preventiva corporativa avançada. Do que a sua empresa necessita hoje?
      <div class="chat-options-group">
        <button class="chat-opt-btn" data-val="Defesa em Processo" data-next="name-request">Defesa Trabalhista Ativa</button>
        <button class="chat-opt-btn" data-val="Compliance Preventivo" data-next="name-request">Compliance &amp; Contratos Novos</button>
        <button class="chat-opt-btn" data-val="Redução de Passivo" data-next="name-request">Reduzir Gastos / Passivo Trabalhista</button>
        <button class="chat-opt-btn" data-val="Assessoria Mensal" data-next="name-request">Assessoria Mensal (Partida)</button>
      </div>`;
    appendChatMessage('bot', text);
    handleChatSelection();
  }

  // Bot Tree branch: Request name (Enables inputs!)
  function requestUserFullName() {
    appendChatMessage('bot', 'Certo. E qual é o seu **nome completo** para abrirmos seu relatório de triagem?');
    
    // Enable Footer Input for Text typing
    const chatInput = document.getElementById('chat-user-text');
    const chatSendBtn = document.getElementById('chat-send-btn');
    if (chatInput && chatSendBtn) {
      chatInput.removeAttribute('disabled');
      chatSendBtn.removeAttribute('disabled');
      chatInput.placeholder = 'Digite seu nome completo aqui...';
      chatInput.focus();
      
      // Submit name event triggers
      const submitNameHandler = () => {
        const typedName = chatInput.value.trim();
        if (typedName.length < 3) {
          alert('Por favor, digite seu nome completo para prosseguirmos.');
          return;
        }
        
        userFullName = typedName;
        chatInput.value = '';
        chatInput.setAttribute('disabled', 'true');
        chatSendBtn.setAttribute('disabled', 'true');
        chatInput.placeholder = 'Triagem concluída.';
        
        appendChatMessage('user', userFullName);
        
        showBotTyping(() => {
          triageFinalConversion();
        });
        
        // Remove event listener to clean up memory
        chatSendBtn.removeEventListener('click', submitNameHandler);
        chatInput.removeEventListener('keypress', keypressHandler);
      };
      
      const keypressHandler = (e) => {
        if (e.key === 'Enter') submitNameHandler();
      };
      
      chatSendBtn.addEventListener('click', submitNameHandler);
      chatInput.addEventListener('keypress', keypressHandler);
    }
  }

  // Bot Tree branch: Final Conversion Button
  function triageFinalConversion() {
    const leadText = `Muito obrigado, **${userFullName}**! 

Com base nos dados fornecidos, seu relatório de triagem foi concluído com sucesso:
- **Perfil:** ${userProfile}
- **Necessidade:** ${selectedNicheOption}

Clique no botão abaixo para iniciar agora o seu atendimento especializado diretamente com o advogado responsável no WhatsApp. Seus dados já estão salvos e anexados à conversa!`;

    appendChatMessage('bot', leadText);
    
    // Create WhatsApp Button inside Bot conversation frame
    const finalBtnWrapper = document.createElement('div');
    finalBtnWrapper.className = 'chat-msg bot';
    
    const formattedLeadMsg = `Olá Falce Advocacia, realizei a triagem automática no site:
- Meu Nome: ${userFullName}
- Meu Perfil: ${userProfile}
- Assunto Indicado: ${selectedNicheOption}`;
    
    const encodedLead = encodeURIComponent(formattedLeadMsg);
    const leadUrl = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}&text=${encodedLead}`;
    
    finalBtnWrapper.innerHTML = `
      <div class="msg-bubble" style="background:var(--bg-primary); border-left: 3px solid #25d366; width:100%;">
        <p style="margin-bottom:12px; font-size:0.8rem; color:var(--text-muted);">Clique para iniciar seu atendimento prioritário:</p>
        <a href="${leadUrl}" target="_blank" class="btn btn-red btn-block btn-red-glow" style="padding:10px 16px; font-size:0.8rem; justify-content:center;">
          <i class="fab fa-whatsapp"></i> Iniciar Atendimento WhatsApp
        </a>
      </div>
    `;
    
    chatMessagesContainer.appendChild(finalBtnWrapper);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }

  // Trigger Chatbot Auto-open reminder on delay (Optional micro-interaction)
  setTimeout(() => {
    if (chatbotWindow && !chatbotWindow.classList.contains('open')) {
      // Auto open dynamic welcome badge
      const badge = chatbotToggleBtn.querySelector('.chatbot-badge-notification');
      if (badge) badge.style.display = 'flex';
    }
  }, 10000);

  /* ==========================================================================
     7. CONTACT FORM SUBMISSION & SUCCESS ANIMATION
     ========================================================================== */
  const contactForm = document.getElementById('main-contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const btnSubmitContact = document.getElementById('btn-submit-contact');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get Form Inputs values
      const nameVal = document.getElementById('contact-name').value.trim();
      const emailVal = document.getElementById('contact-email').value.trim();
      const phoneVal = document.getElementById('contact-phone').value.trim();
      const subjectVal = document.getElementById('contact-subject').value;
      const messageVal = document.getElementById('contact-message').value.trim();
      
      // Clear previous feedbacks
      formFeedback.className = 'form-feedback-message';
      formFeedback.textContent = '';
      
      // Basic client-side validation check
      if (!nameVal || !emailVal || !phoneVal || !subjectVal || !messageVal) {
        formFeedback.classList.add('error');
        formFeedback.textContent = 'Erro: Por favor, preencha todos os campos obrigatórios.';
        return;
      }
      
      // Premium loading feedback animation on the submit button
      btnSubmitContact.setAttribute('disabled', 'true');
      btnSubmitContact.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criptografando Mensagem...';
      
      setTimeout(() => {
        // Successful Simulation response
        btnSubmitContact.removeAttribute('disabled');
        btnSubmitContact.innerHTML = '<i class="far fa-paper-plane"></i> Enviar Mensagem Segura';
        
        formFeedback.classList.add('success');
        formFeedback.textContent = 'Sucesso! Sua mensagem foi enviada com criptografia ponta a ponta. Um advogado especialista entrará em contato em breve.';
        
        // Reset form inputs fields
        contactForm.reset();
        
        // Add a floating class label cleanup trigger
        document.querySelectorAll('.form-control-input').forEach(input => {
          input.blur();
        });
        
        // Clear success message after 8 seconds
        setTimeout(() => {
          formFeedback.style.display = 'none';
        }, 8000);
        
      }, 1800);
    });
  }

  // Open Chatbot Virtual assistant from standard "Analisar meu caso" triggers inside Practice Area cards
  const cardChatOpeners = document.querySelectorAll('.btn-open-chat');
  cardChatOpeners.forEach(opener => {
    opener.addEventListener('click', (e) => {
      e.preventDefault();
      const contextSubject = opener.getAttribute('data-context');
      
      // Toggle chat window open
      if (chatbotWindow) {
        chatbotWindow.classList.add('open');
        
        // Programmatically push message to chatbot and fast-track to name qualification
        showBotTyping(() => {
          appendChatMessage('user', `Preciso de ajuda urgente com: **${contextSubject}**`);
          userProfile = 'Trabalhador / Empresa';
          selectedNicheOption = contextSubject;
          
          showBotTyping(() => {
            requestUserFullName();
          });
        });
      }
    });
  });

  /* ==========================================================================
     8. GOOGLE REVIEWS SLIDER LOGIC
     ========================================================================== */
  const sliderTrack = document.getElementById('reviews-slider-track');
  const prevBtn = document.getElementById('review-prev-btn');
  const nextBtn = document.getElementById('review-next-btn');

  if (sliderTrack && prevBtn && nextBtn) {
    let currentIndex = 0;
    
    function getCardsPerView() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function updateSliderPosition() {
      const card = sliderTrack.querySelector('.review-card');
      if (!card) return;
      
      const cardWidth = card.offsetWidth;
      const gap = parseFloat(window.getComputedStyle(sliderTrack).gap) || 0;
      
      // Calculate transform translation
      const translateValue = currentIndex * (cardWidth + gap);
      sliderTrack.style.transform = `translateX(-${translateValue}px)`;
      
      // Disable/enable arrows appropriately based on boundaries
      const totalCards = sliderTrack.querySelectorAll('.review-card').length;
      const cardsPerView = getCardsPerView();
      
      prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
      prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
      
      const maxIndex = totalCards - cardsPerView;
      nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
      nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
    }

    nextBtn.addEventListener('click', () => {
      const totalCards = sliderTrack.querySelectorAll('.review-card').length;
      const cardsPerView = getCardsPerView();
      const maxIndex = totalCards - cardsPerView;
      
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSliderPosition();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSliderPosition();
      }
    });

    // Handle window resize dynamically to maintain perfect positioning
    window.addEventListener('resize', () => {
      // Re-cap index to prevent overflowing on resizing from mobile to desktop
      const totalCards = sliderTrack.querySelectorAll('.review-card').length;
      const cardsPerView = getCardsPerView();
      const maxIndex = totalCards - cardsPerView;
      if (currentIndex > maxIndex) {
        currentIndex = Math.max(0, maxIndex);
      }
      updateSliderPosition();
    });

    // Initial load layout trigger
    updateSliderPosition();
  }

});

// Handler global para envio do Formulário de Contato Direto do WhatsApp
function handleFormSubmit(event) {
  event.preventDefault();
  
  const perfilSelecionado = document.querySelector('input[name="perfil-cliente"]:checked');
  
  // Se o usuário tentar enviar sem escolher "Trabalhador" ou "Empresa"
  if (!perfilSelecionado) {
    alert("Por favor, selecione se o atendimento é Para o Trabalhador ou Para Empresas antes de prosseguir.");
    return;
  }
  
  const perfil = perfilSelecionado.value;
  const nome = document.getElementById('client-name').value;
  const telefone = document.getElementById('client-phone').value;
  
  const mensagem = `Olá! Gostaria de um atendimento focado em Direito do Trabalho.\n\n*Nome:* ${nome}\n*Telefone:* ${telefone}\n*Perfil:* ${perfil}`;
  const numeroEmpresa = "5512996155317"; 
  
  window.open(`https://api.whatsapp.com/send?phone=${numeroEmpresa}&text=${encodeURIComponent(mensagem)}`, '_blank');
}

