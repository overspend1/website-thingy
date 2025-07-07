// Completely Reformed Experimentation Toolkit
const techStackData = {
  languages: {
    name: "Programming Languages",
    color: "#ff6b6b",
    icon: "icon-code",
    techs: [
      {
        name: "Python",
        proficiency: "Hobby Projects",
        experience: "Building small scripts and automation tools",
        level: 3,
      },
      {
        name: "JavaScript",
        proficiency: "Learning",
        experience: "Frontend experiments and this portfolio",
        level: 2,
      },
      {
        name: "Bash",
        proficiency: "Daily Use",
        experience: "System automation and server management",
        level: 4,
      },
      {
        name: "HTML/CSS",
        proficiency: "Experimenting",
        experience: "Web design and portfolio building",
        level: 3,
      },
    ],
  },
  systems: {
    name: "Operating Systems & Tools",
    color: "#4ecdc4",
    icon: "icon-system",
    techs: [
      {
        name: "Linux",
        proficiency: "Home Lab",
        experience: "Ubuntu/Debian servers, command line daily",
        level: 4,
      },
      {
        name: "Windows",
        proficiency: "Daily Driver",
        experience: "Main desktop OS, PowerShell scripting",
        level: 4,
      },
      {
        name: "Android",
        proficiency: "ROM Tinkering",
        experience: "Custom ROMs, kernel modifications",
        level: 3,
      },
      {
        name: "Docker",
        proficiency: "Container Fun",
        experience: "Self-hosted services containerization",
        level: 2,
      },
    ],
  },
  webtech: {
    name: "Web Technologies",
    color: "#45b7d1",
    icon: "icon-web",
    techs: [
      {
        name: "Apache",
        proficiency: "Home Server",
        experience: "Local web server for projects",
        level: 3,
      },
      {
        name: "Nginx",
        proficiency: "Reverse Proxy",
        experience: "Load balancing for self-hosted apps",
        level: 2,
      },
      {
        name: "Git",
        proficiency: "Version Control",
        experience: "GitHub for project management",
        level: 3,
      },
      {
        name: "Vercel",
        proficiency: "Deployment",
        experience: "Static site hosting experiments",
        level: 2,
      },
    ],
  },
  databases: {
    name: "Data & Databases",
    color: "#96ceb4",
    icon: "icon-database",
    techs: [
      {
        name: "SQLite",
        proficiency: "Simple Projects",
        experience: "Lightweight apps and data storage",
        level: 3,
      },
      {
        name: "MariaDB",
        proficiency: "Home Lab",
        experience: "Database for self-hosted applications",
        level: 2,
      },
      {
        name: "JSON",
        proficiency: "Data Format",
        experience: "API work and configuration files",
        level: 4,
      },
      {
        name: "CSV",
        proficiency: "Data Analysis",
        experience: "Spreadsheet automation and imports",
        level: 3,
      },
    ],
  },
  cloud: {
    name: "Cloud & Hosting",
    color: "#feca57",
    icon: "icon-cloud",
    techs: [
      {
        name: "AWS EC2",
        proficiency: "Experimenting",
        experience: "Free tier server experiments",
        level: 1,
      },
      {
        name: "OVH VPS",
        proficiency: "Hosting",
        experience: "Affordable cloud server testing",
        level: 2,
      },
      {
        name: "GitHub Pages",
        proficiency: "Static Hosting",
        experience: "Portfolio and project demos",
        level: 3,
      },
      {
        name: "Cloudflare",
        proficiency: "DNS/CDN",
        experience: "Domain management and caching",
        level: 2,
      },
    ],
  },
  selfhosted: {
    name: "Self-Hosted Services",
    color: "#ff9ff3",
    icon: "icon-server",
    techs: [
      {
        name: "Plex",
        proficiency: "Media Server",
        experience: "Personal streaming setup at home",
        level: 4,
      },
      {
        name: "Jellyfin",
        proficiency: "Open Source",
        experience: "Alternative media server testing",
        level: 3,
      },
      {
        name: "Pi-hole",
        proficiency: "Network Filter",
        experience: "Network-wide ad blocking",
        level: 3,
      },
      {
        name: "Nextcloud",
        proficiency: "File Sync",
        experience: "Personal cloud storage solution",
        level: 2,
      },
    ],
  },
  hardware: {
    name: "Hardware & Electronics",
    color: "#54a0ff",
    icon: "icon-hardware",
    techs: [
      {
        name: "Arduino",
        proficiency: "Weekend Projects",
        experience: "Basic sensors and LED experiments",
        level: 2,
      },
      {
        name: "Raspberry Pi",
        proficiency: "Home Automation",
        experience: "Self-hosting and IoT projects",
        level: 3,
      },
      {
        name: "PC Building",
        proficiency: "Enthusiast",
        experience: "Custom builds for gaming and servers",
        level: 4,
      },
      {
        name: "Network Setup",
        proficiency: "Home Lab",
        experience: "Router configuration and VLANs",
        level: 3,
      },
    ],
  },
  tools: {
    name: "Development Tools",
    color: "#5f27cd",
    icon: "icon-devtools",
    techs: [
      {
        name: "VS Code",
        proficiency: "Daily Editor",
        experience: "Primary code editor with extensions",
        level: 4,
      },
      {
        name: "Terminal",
        proficiency: "Command Line",
        experience: "Daily workflow, multiple shell environments",
        level: 4,
      },
      {
        name: "GitHub",
        proficiency: "Version Control",
        experience: "Repository management and collaboration",
        level: 3,
      },
      {
        name: "Postman",
        proficiency: "API Testing",
        experience: "REST API development and testing",
        level: 2,
      },
    ],
  },
};

class ExperimentationToolkit {
  constructor() {
    this.currentFilter = "all";
    this.searchTerm = "";
    this.selectedTech = null;
    this.init();
  }

  init() {
    this.renderTechGrid();
    this.setupEventListeners();
    this.createTechModal();
  }

  renderTechGrid() {
    const grid = document.getElementById("tech-grid");
    if (!grid) return;

    grid.innerHTML = "";

    Object.entries(techStackData).forEach(([category, data]) => {
      if (this.currentFilter !== "all" && this.currentFilter !== category)
        return;

      data.techs.forEach((tech) => {
        if (
          this.searchTerm &&
          !tech.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
          return;

        const techCard = this.createEnhancedTechCard(tech, category, data);
        grid.appendChild(techCard);
      });
    });
  }

  createEnhancedTechCard(tech, category, categoryData) {
    const card = document.createElement("div");
    card.className = "tech-card enhanced";
    card.setAttribute("data-category", category);
    card.setAttribute("data-tech", tech.name);

    // Proficiency level bars
    const proficiencyBars = this.createProficiencyBars(tech.level);

    card.innerHTML = `
            <div class="tech-card-inner">
                <div class="tech-icon ${categoryData.icon}"></div>
                <div class="tech-name">${tech.name}</div>
                <div class="tech-proficiency">${tech.proficiency}</div>
                <div class="proficiency-bars">${proficiencyBars}</div>
                <div class="tech-experience">${tech.experience}</div>
                <div class="learn-more">Click to learn more</div>
            </div>
        `;

    // Enhanced hover effects
    card.addEventListener("mouseenter", () => {
      card.style.borderColor = categoryData.color;
      card.style.boxShadow = `0 15px 35px ${categoryData.color}40`;
      card.style.transform = "translateY(-8px) scale(1.02)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.borderColor = "rgba(255, 255, 255, 0.1)";
      card.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
      card.style.transform = "translateY(0) scale(1)";
    });

    // Click to show detailed modal
    card.addEventListener("click", () => {
      this.showTechModal(tech, categoryData);
    });

    return card;
  }

  createProficiencyBars(level) {
    let bars = "";
    for (let i = 1; i <= 5; i++) {
      const isActive = i <= level;
      bars += `<div class="prof-bar ${isActive ? "active" : ""}"></div>`;
    }
    return bars;
  }

  createTechModal() {
    const modal = document.createElement("div");
    modal.id = "tech-modal";
    modal.className = "tech-modal";
    modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title"></h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-icon"></div>
                    <div class="modal-proficiency"></div>
                    <div class="modal-experience"></div>
                    <div class="modal-level"></div>
                </div>
            </div>
        `;
    document.body.appendChild(modal);

    // Close modal events
    modal
      .querySelector(".modal-close")
      .addEventListener("click", () => this.closeTechModal());
    modal
      .querySelector(".modal-overlay")
      .addEventListener("click", () => this.closeTechModal());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeTechModal();
    });
  }

  showTechModal(tech, categoryData) {
    const modal = document.getElementById("tech-modal");

    modal.querySelector(".modal-title").textContent = tech.name;
    modal.querySelector(".modal-icon").className =
      `modal-icon ${categoryData.icon}`;
    modal.querySelector(".modal-proficiency").innerHTML = `
            <strong>Current Level:</strong> ${tech.proficiency}
        `;
    modal.querySelector(".modal-experience").innerHTML = `
            <strong>My Experience:</strong><br>${tech.experience}
        `;
    modal.querySelector(".modal-level").innerHTML = `
            <strong>Proficiency:</strong><br>
            <div class="modal-prof-bars">${this.createProficiencyBars(tech.level)}</div>
            <span class="prof-text">${this.getProficiencyText(tech.level)}</span>
        `;

    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("active"), 10);
    document.body.style.overflow = "hidden";
  }

  closeTechModal() {
    const modal = document.getElementById("tech-modal");
    modal.classList.remove("active");
    setTimeout(() => {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }, 300);
  }

  getProficiencyText(level) {
    const levels = {
      1: "Just started experimenting",
      2: "Getting familiar with basics",
      3: "Comfortable with common tasks",
      4: "Use regularly and confidently",
      5: "Deep knowledge and daily use",
    };
    return levels[level] || "Learning in progress";
  }

  setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentFilter = btn.getAttribute("data-category");
        this.renderTechGrid();
      });
    });

    // Search input
    const searchInput = document.getElementById("tech-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchTerm = e.target.value;
        this.renderTechGrid();
      });
    }
  }
}

// Initialize experimentation toolkit
document.addEventListener("DOMContentLoaded", function () {
  new ExperimentationToolkit();
});
