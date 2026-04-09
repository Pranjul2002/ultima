import styles from "./contactus.module.css";

const ContactPage = () => {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Contact Us</p>
        <h1 className={styles.title}>Let’s talk</h1>
        <p className={styles.subtitle}>
          Have a question, suggestion, or partnership idea? Send us a message and
          we’ll get back to you as soon as possible.
        </p>
      </section>

      <section className={styles.content}>
        <div className={styles.infoCard}>
          <h2 className={styles.cardTitle}>Get in touch</h2>
          <p className={styles.cardText}>
            We’d love to hear from you. Reach out through the form or use the
            contact details below.
          </p>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>support@ultima.com</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Phone</span>
              <span className={styles.infoValue}>+91 98765 43210</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Address</span>
              <span className={styles.infoValue}>
                Kolkata, West Bengal, India
              </span>
            </div>
          </div>
        </div>

        <form className={styles.formCard}>
          <h2 className={styles.cardTitle}>Send a message</h2>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter your full name"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Subject</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter subject"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Message</label>
            <textarea
              className={styles.textarea}
              placeholder="Write your message"
              rows={6}
            />
          </div>

          <button type="submit" className={styles.button}>
            Send Message
          </button>
        </form>
      </section>
    </main>
  );
};

export default ContactPage;