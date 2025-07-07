// ROM Mirror File Browser Functionality
class ROMFileBrowser {
  constructor() {
    this.currentPath = [];
    this.files = [];
    this.filteredFiles = [];
    this.viewMode = "grid"; // grid or list
    this.isUploading = false;

    this.init();
    this.loadGoogleDriveData();
  }

  init() {
    this.setupEventListeners();
    this.renderFiles();
  }

  // Secure configuration getter - checks multiple sources
  getConfig(key) {
    // 1. Check if config is defined in a separate config file
    if (typeof window.ROM_MIRROR_CONFIG !== "undefined") {
      return window.ROM_MIRROR_CONFIG[key];
    }

    // 2. Check environment variables (if using build tools)
    if (typeof process !== "undefined" && process.env) {
      return process.env[key];
    }

    // 3. Check for config in localStorage (for development)
    const localConfig = localStorage.getItem(`rom_config_${key}`);
    if (localConfig) {
      return localConfig;
    }

    return null;
  }

  // Google Drive API integration
  async loadGoogleDriveData() {
    this.showLoading();

    try {
      // Your Google Drive shared folder ID - replace with your actual folder ID
      // Configuration - Replace with your own values
      const folderId =
        this.getConfig("DRIVE_FOLDER_ID") || "YOUR_FOLDER_ID_HERE";
      const apiKey = this.getConfig("DRIVE_API_KEY") || "YOUR_API_KEY_HERE";

      await this.loadDriveFiles(folderId, apiKey);
    } catch (error) {
      console.error("Error loading Google Drive files:", error);
      this.showError("Failed to load files from Google Drive");
      this.loadOfflineData(); // Fallback to local data
    }
  }

  async loadDriveFiles(folderId, apiKey, parentPath = []) {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType,size,modifiedTime,webContentLink,webViewLink)`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      this.files = await this.processDriveFiles(data.files, apiKey);
      this.hideLoading();
      this.renderFiles();
    } catch (error) {
      throw error;
    }
  }

  async processDriveFiles(files, apiKey) {
    const processedFiles = [];

    for (const file of files) {
      const isFolder = file.mimeType === "application/vnd.google-apps.folder";

      const processedFile = {
        id: file.id,
        name: file.name,
        type: isFolder ? "folder" : "file",
        extension: isFolder ? null : this.getFileExtension(file.name),
        size: isFolder ? null : this.formatFileSize(parseInt(file.size) || 0),
        date: this.formatDate(file.modifiedTime),
        downloadUrl: file.webContentLink,
        viewUrl: file.webViewLink,
        downloads: this.getStoredDownloadCount(file.id),
        description: this.getFileDescription(file.name),
      };

      if (isFolder) {
        // Load folder contents
        processedFile.children = await this.loadFolderContents(file.id, apiKey);
      }

      processedFiles.push(processedFile);
    }

    return processedFiles;
  }

  async loadFolderContents(folderId, apiKey) {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType,size,modifiedTime,webContentLink,webViewLink)`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) return [];

      return await this.processDriveFiles(data.files, apiKey);
    } catch (error) {
      console.error("Error loading folder contents:", error);
      return [];
    }
  }

  getFileExtension(filename) {
    return filename.split(".").pop().toLowerCase();
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  }

  getFileDescription(filename) {
    const descriptions = {
      lineage: "LineageOS custom ROM",
      aosp: "AOSP Android system image",
      twrp: "TWRP custom recovery",
      kernel: "Custom kernel modification",
      fastboot: "Android fastboot tools",
      bootloader: "Device bootloader",
    };

    const key = Object.keys(descriptions).find((k) =>
      filename.toLowerCase().includes(k),
    );

    return key ? descriptions[key] : `ROM file: ${filename}`;
  }

  getStoredDownloadCount(fileId) {
    const counts = JSON.parse(
      localStorage.getItem("romDownloadCounts") || "{}",
    );
    return counts[fileId] || 0;
  }

  updateDownloadCount(fileId) {
    const counts = JSON.parse(
      localStorage.getItem("romDownloadCounts") || "{}",
    );
    counts[fileId] = (counts[fileId] || 0) + 1;
    localStorage.setItem("romDownloadCounts", JSON.stringify(counts));
    return counts[fileId];
  }

  showLoading() {
    const grid = document.getElementById("file-grid");
    if (grid) {
      grid.innerHTML = `
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <h3>Loading ROM files...</h3>
          <p>Connecting to Google Drive</p>
        </div>
      `;
    }
  }

  hideLoading() {
    // Loading will be hidden when files render
  }

  showError(message) {
    const grid = document.getElementById("file-grid");
    if (grid) {
      grid.innerHTML = `
        <div class="error-state">
          <span class="icon-cloud"></span>
          <h3>Connection Error</h3>
          <p>${message}</p>
          <button class="retry-btn" onclick="romBrowser.loadGoogleDriveData()">Retry</button>
        </div>
      `;
    }
  }

  loadOfflineData() {
    // Fallback data when Google Drive is unavailable
    this.files = [
      {
        id: "offline-1",
        name: "Connection Error",
        type: "folder",
        children: [
          {
            id: "offline-readme",
            name: "README.txt",
            type: "file",
            extension: "txt",
            size: "1 KB",
            date: new Date().toISOString().split("T")[0],
            downloads: 0,
            description:
              "Google Drive connection unavailable. Please check your internet connection and API configuration.",
          },
        ],
      },
    ];
    this.renderFiles();
  }

  setupEventListeners() {
    // View toggle
    const viewToggle = document.getElementById("view-toggle");
    if (viewToggle) {
      viewToggle.addEventListener("click", () => this.toggleView());
    }

    // Upload button
    const uploadBtn = document.getElementById("upload-btn");
    if (uploadBtn) {
      uploadBtn.addEventListener("click", () => this.showUploadArea());
    }

    // Search functionality
    const searchInput = document.getElementById("file-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) =>
        this.handleSearch(e.target.value),
      );
    }

    // Upload area
    const uploadArea = document.getElementById("upload-area");
    const fileInput = document.getElementById("file-input");

    if (uploadArea && fileInput) {
      uploadArea.addEventListener("click", () => fileInput.click());
      uploadArea.addEventListener("dragover", (e) => this.handleDragOver(e));
      uploadArea.addEventListener("dragleave", (e) => this.handleDragLeave(e));
      uploadArea.addEventListener("drop", (e) => this.handleDrop(e));

      fileInput.addEventListener("change", (e) =>
        this.handleFileSelect(e.target.files),
      );
    }

    // Close upload area on escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hideUploadArea();
      }
    });
  }

  getCurrentFiles() {
    let current = this.files;

    for (const pathItem of this.currentPath) {
      const folder = current.find(
        (item) => item.name === pathItem && item.type === "folder",
      );
      if (folder && folder.children) {
        current = folder.children;
      }
    }

    return current;
  }

  renderFiles() {
    const grid = document.getElementById("file-grid");
    if (!grid) return;

    const currentFiles = this.getCurrentFiles();
    this.filteredFiles = currentFiles;

    grid.innerHTML = "";
    grid.className = `file-grid ${this.viewMode}-view`;

    if (currentFiles.length === 0) {
      this.renderEmptyState(grid);
      return;
    }

    currentFiles.forEach((file, index) => {
      const fileElement = this.createFileElement(file, index);
      grid.appendChild(fileElement);
    });

    this.updateBreadcrumb();
  }

  createFileElement(file, index) {
    const fileItem = document.createElement("div");
    fileItem.className = `file-item ${file.type} ${file.extension || ""}`;
    fileItem.style.animationDelay = `${index * 0.1}s`;

    const iconClass = this.getFileIcon(file);

    fileItem.innerHTML = `
            <div class="file-icon ${iconClass}"></div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-meta">
                    ${file.size ? `<span class="file-size">${file.size}</span> • ` : ""}
                    <span class="file-date">${file.date || "Unknown"}</span>
                    ${file.downloads ? ` • ${file.downloads} downloads` : ""}
                </div>
                ${file.description ? `<div class="file-description">${file.description}</div>` : ""}
            </div>
            <div class="file-actions">
                ${
                  file.type === "folder"
                    ? '<button class="action-btn open"><span class="icon-folder"></span> Open</button>'
                    : `<button class="action-btn download"><span class="icon-download"></span> Download</button>
                     <button class="action-btn info"><span class="icon-info"></span> Info</button>
                     <button class="action-btn delete"><span class="icon-delete"></span> Delete</button>`
                }
            </div>
        `;

    // Add event listeners
    if (file.type === "folder") {
      fileItem.addEventListener("dblclick", () => this.openFolder(file.name));
      fileItem
        .querySelector(".action-btn.open")
        ?.addEventListener("click", (e) => {
          e.stopPropagation();
          this.openFolder(file.name);
        });
    } else {
      fileItem
        .querySelector(".action-btn.download")
        ?.addEventListener("click", (e) => {
          e.stopPropagation();
          this.downloadFile(file);
        });

      fileItem
        .querySelector(".action-btn.info")
        ?.addEventListener("click", (e) => {
          e.stopPropagation();
          this.showFileInfo(file);
        });

      fileItem
        .querySelector(".action-btn.delete")
        ?.addEventListener("click", (e) => {
          e.stopPropagation();
          this.deleteFile(file);
        });
    }

    return fileItem;
  }

  getFileIcon(file) {
    if (file.type === "folder") return "icon-folder";

    switch (file.extension) {
      case "zip":
      case "rar":
      case "7z":
        return "icon-zip";
      case "img":
      case "iso":
        return "icon-image";
      default:
        return "icon-file";
    }
  }

  renderEmptyState(container) {
    container.innerHTML = `
            <div class="empty-state">
                <span class="icon-folder"></span>
                <h3>No files found</h3>
                <p>This folder is empty or no files match your search.</p>
            </div>
        `;
  }

  openFolder(folderName) {
    this.currentPath.push(folderName);
    this.renderFiles();
  }

  navigateToPath(pathIndex) {
    this.currentPath = this.currentPath.slice(0, pathIndex);
    this.renderFiles();
  }

  updateBreadcrumb() {
    const breadcrumb = document.getElementById("breadcrumb-nav");
    if (!breadcrumb) return;

    const items = ["ROM Mirror", ...this.currentPath];

    breadcrumb.innerHTML = items
      .map((item, index) => {
        const isLast = index === items.length - 1;
        return `<span class="breadcrumb-item ${isLast ? "active" : ""}"
                           onclick="romBrowser.navigateToPath(${index})">${item}</span>`;
      })
      .join("");
  }

  toggleView() {
    this.viewMode = this.viewMode === "grid" ? "list" : "grid";

    const viewToggle = document.getElementById("view-toggle");
    if (viewToggle) {
      const icon = viewToggle.querySelector("span");
      icon.className = this.viewMode === "grid" ? "icon-grid" : "icon-server";
    }

    this.renderFiles();
  }

  handleSearch(query) {
    if (!query.trim()) {
      this.renderFiles();
      return;
    }

    const currentFiles = this.getCurrentFiles();
    this.filteredFiles = currentFiles.filter(
      (file) =>
        file.name.toLowerCase().includes(query.toLowerCase()) ||
        (file.description &&
          file.description.toLowerCase().includes(query.toLowerCase())),
    );

    const grid = document.getElementById("file-grid");
    if (!grid) return;

    grid.innerHTML = "";
    grid.className = `file-grid ${this.viewMode}-view`;

    if (this.filteredFiles.length === 0) {
      grid.innerHTML = `
                <div class="empty-state">
                    <span class="icon-folder"></span>
                    <h3>No results found</h3>
                    <p>No files match "${query}". Try a different search term.</p>
                </div>
            `;
      return;
    }

    this.filteredFiles.forEach((file, index) => {
      const fileElement = this.createFileElement(file, index);
      grid.appendChild(fileElement);
    });
  }

  showUploadArea() {
    const uploadArea = document.getElementById("upload-area");
    if (uploadArea) {
      uploadArea.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  hideUploadArea() {
    const uploadArea = document.getElementById("upload-area");
    if (uploadArea) {
      uploadArea.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  handleDragOver(e) {
    e.preventDefault();
    const browser = document.querySelector(".file-browser");
    if (browser) {
      browser.classList.add("dragover");
    }
  }

  handleDragLeave(e) {
    e.preventDefault();
    const browser = document.querySelector(".file-browser");
    if (browser) {
      browser.classList.remove("dragover");
    }
  }

  handleDrop(e) {
    e.preventDefault();
    const browser = document.querySelector(".file-browser");
    if (browser) {
      browser.classList.remove("dragover");
    }

    const files = e.dataTransfer.files;
    this.handleFileSelect(files);
  }

  handleFileSelect(files) {
    if (files.length === 0) return;

    this.uploadFiles(files);
  }

  uploadFiles(files) {
    if (this.isUploading) return;

    this.isUploading = true;
    const progressElement = document.getElementById("upload-progress");
    const progressText = progressElement?.querySelector(".progress-text");

    if (progressElement) {
      progressElement.classList.add("active");
      // Create progress bar fill if it doesn't exist
      let progressBar = progressElement.querySelector(".progress-bar");
      if (progressBar && !progressBar.querySelector(".progress-bar-fill")) {
        progressBar.innerHTML = '<div class="progress-bar-fill"></div>';
      }
    }

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setTimeout(() => {
          this.completeUpload(files);
        }, 500);
      }

      const progressBarFill =
        progressElement?.querySelector(".progress-bar-fill");
      if (progressBarFill) {
        progressBarFill.style.width = `${progress}%`;
      }

      if (progressText) {
        progressText.textContent = `${Math.round(progress)}%`;
      }
    }, 200);
  }

  completeUpload(files) {
    this.isUploading = false;

    // Add uploaded files to current folder (simulation)
    const currentFiles = this.getCurrentFiles();

    Array.from(files).forEach((file) => {
      const fileObj = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: "file",
        extension: file.name.split(".").pop(),
        size: this.formatFileSize(file.size),
        date: new Date().toISOString().split("T")[0],
        downloads: 0,
        description: `Uploaded ${file.name}`,
      };

      currentFiles.push(fileObj);
    });

    this.hideUploadArea();
    this.renderFiles();

    // Reset progress bar
    const progressElement = document.getElementById("upload-progress");
    if (progressElement) {
      progressElement.classList.remove("active");
      const progressBarFill =
        progressElement.querySelector(".progress-bar-fill");
      if (progressBarFill) {
        progressBarFill.style.width = "0%";
      }
      const progressText = progressElement.querySelector(".progress-text");
      if (progressText) {
        progressText.textContent = "0%";
      }
    }

    // Show success message
    this.showNotification(
      `Successfully uploaded ${files.length} file(s)`,
      "success",
    );
  }

  downloadFile(file) {
    if (file.downloadUrl) {
      // Open Google Drive download link
      window.open(file.downloadUrl, "_blank");

      // Update download count
      const newCount = this.updateDownloadCount(file.id);
      file.downloads = newCount;

      this.showNotification(`Downloading ${file.name}...`, "success");
      this.renderFiles();
    } else {
      this.showNotification(
        `Download link not available for ${file.name}`,
        "error",
      );
    }
  }

  showFileInfo(file) {
    // Create and show file info modal
    const modal = document.createElement("div");
    modal.className = "file-info-modal";
    modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>File Information</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="file-info-item"><strong>Name:</strong> ${file.name}</div>
                    <div class="file-info-item"><strong>Size:</strong> ${file.size}</div>
                    <div class="file-info-item"><strong>Date:</strong> ${file.date}</div>
                    <div class="file-info-item"><strong>Downloads:</strong> ${file.downloads || 0}</div>
                    ${file.description ? `<div class="file-info-item"><strong>Description:</strong> ${file.description}</div>` : ""}
                </div>
            </div>
        `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add("active"), 10);

    // Close modal events
    modal
      .querySelector(".modal-close")
      .addEventListener("click", () => this.closeModal(modal));
    modal
      .querySelector(".modal-overlay")
      .addEventListener("click", () => this.closeModal(modal));
  }

  deleteFile(file) {
    if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
      const currentFiles = this.getCurrentFiles();
      const index = currentFiles.findIndex((f) => f.id === file.id);

      if (index !== -1) {
        currentFiles.splice(index, 1);
        this.renderFiles();
        this.showNotification(`Deleted ${file.name}`, "success");
      }
    }
  }

  closeModal(modal) {
    modal.classList.remove("active");
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 300);
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            border: 1px solid ${type === "success" ? "#00ff88" : type === "error" ? "#ff4757" : "#00ccff"};
            z-index: 10001;
            backdrop-filter: blur(10px);
            animation: slideIn 0.3s ease;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease forwards";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Enhanced scroll reveal for ROM mirror section
class ROMScrollReveal {
  constructor() {
    this.init();
  }

  init() {
    this.observeROMSection();
  }

  observeROMSection() {
    const romSection = document.getElementById("rom-mirror");

    if (!romSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateROMReveal();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(romSection);
  }

  animateROMReveal() {
    const fileBrowser = document.querySelector(".file-browser");
    const disclaimer = document.querySelector(".rom-disclaimer");

    // Animate disclaimer
    if (disclaimer) {
      disclaimer.style.opacity = "0";
      disclaimer.style.transform = "translateY(20px)";

      setTimeout(() => {
        disclaimer.style.transition = "all 0.8s ease";
        disclaimer.style.opacity = "1";
        disclaimer.style.transform = "translateY(0)";
      }, 200);
    }

    // Animate file browser
    if (fileBrowser) {
      fileBrowser.style.opacity = "0";
      fileBrowser.style.transform = "translateY(30px) scale(0.98)";

      setTimeout(() => {
        fileBrowser.style.transition = "all 1s cubic-bezier(0.4, 0, 0.2, 1)";
        fileBrowser.style.opacity = "1";
        fileBrowser.style.transform = "translateY(0) scale(1)";
      }, 400);
    }
  }
}

// Add notification animations to CSS
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
    .loading-state, .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem;
        text-align: center;
        color: rgba(255, 255, 255, 0.7);
        grid-column: 1 / -1;
    }

    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(0, 255, 136, 0.3);
        border-top: 3px solid #00ff88;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1.5rem;
    }

    .error-state .icon-cloud {
        font-size: 4rem;
        color: rgba(255, 107, 107, 0.5);
        margin-bottom: 1rem;
        display: block;
    }

    .retry-btn {
        background: rgba(0, 255, 136, 0.2);
        border: 1px solid rgba(0, 255, 136, 0.5);
        color: #00ff88;
        padding: 12px 24px;
        border-radius: 25px;
        cursor: pointer;
        margin-top: 1.5rem;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    }

    .retry-btn:hover {
        background: rgba(0, 255, 136, 0.3);
        transform: translateY(-2px);
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .file-info-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .file-info-modal.active {
        opacity: 1;
    }

    .file-info-modal .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
    }

    .file-info-modal .modal-content {
        position: relative;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        color: white;
    }

    .file-info-modal .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .file-info-modal .modal-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        transition: background 0.3s ease;
    }

    .file-info-modal .modal-close:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .file-info-item {
        margin-bottom: 1rem;
        line-height: 1.5;
    }

    .file-info-item strong {
        color: #00ff88;
    }
`;
document.head.appendChild(notificationStyles);

// Initialize when DOM is loaded
let romBrowser;

document.addEventListener("DOMContentLoaded", () => {
  // Check if ROM mirror section exists before initializing
  const romSection = document.getElementById("rom-mirror");
  if (romSection) {
    romBrowser = new ROMFileBrowser();
    new ROMScrollReveal();
  }
});
