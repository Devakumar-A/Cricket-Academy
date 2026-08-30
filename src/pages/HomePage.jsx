function HomePage({ onSection }) {
  return (
    <main className="home-page">
      <section className="home-hero">
        <p className="eyebrow">CRICKET ACADEMY</p>

        <h1>Train. Play. Grow.</h1>

        <p>
          Access turf booking, academy admissions and player statistics
          from one place.
        </p>

        <div className="home-actions">
          <button onClick={() => onSection("booking")}>
            Turf Booking
          </button>

          <button onClick={() => onSection("admission")}>
            Academy Admission
          </button>
        </div>
      </section>

      <section className="home-cards">
        <div
          className="home-card"
          onClick={() => onSection("booking")}
        >
          <span>🏟️</span>
          <h3>Turf Booking</h3>
          <p>Request a turf slot quickly.</p>
        </div>

        <div
          className="home-card"
          onClick={() => onSection("admission")}
        >
          <span>📝</span>
          <h3>Academy Admission</h3>
          <p>Submit your academy application.</p>
        </div>

        <div
          className="home-card"
          onClick={() => onSection("players")}
        >
          <span>🏏</span>
          <h3>Player Stats</h3>
          <p>Explore our players and their statistics.</p>
        </div>
      </section>
    </main>
  );
}

export default HomePage;