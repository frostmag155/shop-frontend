import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SupportPage.css';

const SupportPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqItems = [
    {
      question: "Какие способы оплаты доступны?",
      answer: "Мы принимаем карты Visa, MasterCard, Мир, а также оплату через ЮMoney и наличными при получении заказа."
    },
    {
      question: "Можно ли вернуть товар?",
      answer: "Да, возврат возможен в течение 14 дней с момента получения заказа при сохранении товарного вида, упаковки и всех комплектующих."
    },
    {
      question: "Сколько длится доставка?",
      answer: "В пределах Москвы — 1-2 дня, по России — от 3 до 7 рабочих дней в зависимости от региона."
    },
    {
      question: "Предоставляется ли гарантия на технику?",
      answer: "Да, вся техника Apple имеет официальную гарантию производителя от 1 года. Дополнительно мы предоставляем сервисную поддержку."
    },
    {
      question: "Как проверить подлинность устройства?",
      answer: "Все устройства имеют серийные номера, которые можно проверить на официальном сайте Apple. Мы предоставляем все необходимые документы."
    },
    {
      question: "Есть ли рассрочка или кредит?",
      answer: "Да, мы сотрудничаем с несколькими банками и предлагаем выгодные условия рассрочки и кредитования."
    }
  ];

  const supportCards = [
    {
      icon: "📦",
      title: "Доставка",
      description: "Узнайте о сроках и способах доставки в ваш регион",
      link: "#delivery"
    },
    {
      icon: "🔄",
      title: "Возврат",
      description: "Техника не подошла? Мы расскажем, как вернуть товар",
      link: "#returns"
    },
    {
      icon: "💳",
      title: "Оплата",
      description: "Все доступные способы оплаты и безопасность транзакций",
      link: "#payment"
    },
    {
      icon: "🔧",
      title: "Гарантия",
      description: "Вся техника Apple имеет официальную гарантию",
      link: "/about"
    }
  ];

  return (
    <div className="support-page">
      <div className="support-container">
        <h1>Служба поддержки</h1>
        <p className="support-intro">
          Мы всегда готовы помочь вам с любыми вопросами. Выберите нужный раздел или свяжитесь с нами напрямую.
        </p>

        <div className="support-cards">
          {supportCards.map((card, index) => (
            <div key={index} className="support-card">
              <div className="card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link to={card.link} className="card-link">
                Подробнее →
              </Link>
            </div>
          ))}
        </div>

        <section className="faq-section">
          <h2>Часто задаваемые вопросы</h2>
          <div className="faq-list">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
              >
                <div 
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className="faq-toggle">
                    {activeFaq === index ? '−' : '+'}
                  </span>
                </div>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-section">
          <h2>Связаться с поддержкой</h2>
          <p>Если вы не нашли ответа на свой вопрос, напишите или позвоните нам:</p>
          
          <div className="contact-methods">
            <div className="contact-method">
              <div className="contact-icon">📧</div>
              <div className="contact-info">
                <h3>Электронная почта</h3>
                <p>maximtroshkin12@yandex.ru</p>
                <small>Ответ в течение 2 часов</small>
              </div>
            </div>
            
            <div className="contact-method">
              <div className="contact-icon">📞</div>
              <div className="contact-info">
                <h3>Телефон</h3>
                <p>8 (111) 222-33-44</p>
                <small>Бесплатно по России</small>
              </div>
            </div>
            
            
          </div>

          <div className="contact-actions">
            <Link to="/contacts" className="btn-primary">
              Полная контактная информация
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SupportPage;