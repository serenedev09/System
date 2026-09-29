/**
 * MyEstia - Category Management Service
 * Manages category state, color picking, icon selection, and UI rendering.
 */

const CategoryManager = {
  categories: [],
  selectedCategoryId: '',

  async init() {
    await this.loadCategories();
    this.bindEvents();
  },

  async loadCategories() {
    try {
      const res = await API.categories.getAll();
      if (res.success) {
        this.categories = res.categories || [];
        this.renderSidebarCategories();
        this.renderTaskFilterChips();
        this.renderTaskModalSelect();
        this.renderCategoriesView();

        // Update sidebar count
        const countBadge = document.getElementById('sidebar-cat-count');
        if (countBadge) countBadge.textContent = this.categories.length;
      }
    } catch (e) {
      console.error('Failed to load categories:', e);
    }
  },

  getCategoryIconSvg(iconName) {
    const icons = {
      'fa-tag': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6V4.5C3 3.7 3.7 3 4.5 3H6C6.5 3 7 3.2 7.3 3.6L20 18C20.6 18.7 20.5 19.7 19.9 20.3L18.3 21.9C17.7 22.5 16.7 22.5 16 21.9L3.4 7.3C3.1 7 3 6.5 3 6Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><circle cx="6.5" cy="6.5" r="1.3" fill="currentColor"/></svg>',
      'fa-briefcase': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="18" height="13" rx="2.5" stroke="currentColor" stroke-width="1.9"/><path d="M9 7V5C9 4 10 3 11 3H13C14 3 15 4 15 5V7" stroke="currentColor" stroke-width="1.9"/><path d="M3 12H21" stroke="currentColor" stroke-width="1.9"/><path d="M12 12V14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
      'fa-graduation-cap': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L22 9L12 14L2 9L12 4Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M6 11V16C6 16 8.5 18 12 18C15.5 18 18 16 18 16V11" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M22 9V15" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
      'fa-user': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.9"/><path d="M4 20C4 16.5 7.5 14 12 14C16.5 14 20 16.5 20 20" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
      'fa-heart-pulse': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20S3 14 3 8.5C3 6 5 4 7.5 4C9.5 4 11 5.2 12 7C13 5.2 14.5 4 16.5 4C19 4 21 6 21 8.5C21 14 12 20 12 20Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M5 11H9L10.5 9L12 13L13.5 11H19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      'fa-wallet': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="18" height="14" rx="2.5" stroke="currentColor" stroke-width="1.9"/><path d="M3 10H21" stroke="currentColor" stroke-width="1.9"/><circle cx="17" cy="15" r="1.2" fill="currentColor"/></svg>',
      'fa-rocket': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3C12 3 16 5 16 11L18 15L14 14L12 16L10 14L6 15L8 11C8 5 12 3 12 3Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><circle cx="12" cy="9" r="1.5" stroke="currentColor" stroke-width="1.7"/><path d="M10 17L9 21M14 17L15 21" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
      'fa-cart-shopping': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 4H6L8 17H19L21 8H6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="20" r="1.5" stroke="currentColor" stroke-width="1.7"/><circle cx="17" cy="20" r="1.5" stroke="currentColor" stroke-width="1.7"/></svg>',
      'fa-book': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H10C11 4 12 5 12 6V20C12 19 11 18 10 18H4V4Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M20 4H14C13 4 12 5 12 6V20C12 19 13 18 14 18H20V4Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>',
      'fa-code': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 7L4 12L9 17M15 7L20 12L15 17" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      'fa-chart-pie': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3V12H21A9 9 0 0 0 12 3Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M12 12V21A9 9 0 0 0 21 12H12Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>',
      'fa-clock': '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.9"/><path d="M12 7V12L15.5 14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    };

    return icons[iconName] || icons['fa-tag'];
  },

  renderSidebarCategories() {
    const list = document.getElementById('sidebar-category-list');
    if (!list) return;

    let html = '';
    this.categories.forEach(cat => {
      const isActive = this.selectedCategoryId === String(cat.id);
      const catIconSvg = CategoryManager.getCategoryIconSvg(cat.icon);
      html += `
        <div class="nav-item ${isActive ? 'active' : ''}" data-cat-id="${cat.id}" onclick="CategoryManager.selectCategory('${cat.id}')">
          <div class="nav-item-left">
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; color: ${cat.color}; flex-shrink: 0;">
              ${catIconSvg}
            </span>
            <span>${this.escapeHtml(cat.name)}</span>
          </div>
          <span class="nav-badge">${cat.active_tasks || 0}</span>
        </div>
      `;
    });

    list.innerHTML = html;
  },

  renderTaskFilterChips() {
    const bar = document.getElementById('tasks-category-chips');
    if (!bar) return;

    let html = `
      <div class="category-chip ${this.selectedCategoryId === '' ? 'active' : ''}" data-cat-id="" onclick="CategoryManager.selectCategory('')">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" stroke="currentColor" stroke-width="1.9"/>
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" stroke="currentColor" stroke-width="1.9"/>
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" stroke-width="1.9"/>
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" stroke-width="1.9"/>
        </svg>
        All Categories
      </div>
    `;

    this.categories.forEach(cat => {
      const isActive = this.selectedCategoryId === String(cat.id);
      const catIconSvg = CategoryManager.getCategoryIconSvg(cat.icon);
      html += `
        <div class="category-chip ${isActive ? 'active' : ''}" data-cat-id="${cat.id}" onclick="CategoryManager.selectCategory('${cat.id}')">
          <span style="display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; color: ${cat.color}; flex-shrink: 0;">
            ${catIconSvg}
          </span>
          <span>${this.escapeHtml(cat.name)}</span>
          <span style="font-size: 0.72rem; opacity: 0.7; margin-left: 0.2rem;">(${cat.active_tasks || 0})</span>
        </div>
      `;
    });

    bar.innerHTML = html;
  },

  renderTaskModalSelect() {
    const select = document.getElementById('task-input-category');
    if (!select) return;

    let html = '<option value="">-- No Category --</option>';
    this.categories.forEach(cat => {
      html += `<option value="${cat.id}">${this.escapeHtml(cat.name)}</option>`;
    });
    select.innerHTML = html;
  },

  renderCategoriesView() {
    const grid = document.getElementById('categories-main-grid');
    if (!grid) return;

    if (this.categories.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1.5rem; background: var(--glass-bg); border-radius: var(--radius-lg); border: var(--glass-border); color: var(--text-muted);">
          <svg viewBox="0 0 24 24" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 1rem; color: var(--text-subtle);">
            <path d="M3 6V4.5C3 3.7 3.7 3 4.5 3H6C6.5 3 7 3.2 7.3 3.6L20 18C20.6 18.7 20.5 19.7 19.9 20.3L18.3 21.9C17.7 22.5 16.7 22.5 16 21.9L3.4 7.3C3.1 7 3 6.5 3 6Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>
            <circle cx="6.5" cy="6.5" r="1.3" fill="currentColor"/>
          </svg>
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-main);">No Categories Active</h3>
          <p style="max-width: 480px; margin: 0 auto 1.5rem; font-size: 0.9rem;">You can organize your tasks with custom categories or restore the suggested default categories.</p>
          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn-primary" onclick="CategoryManager.restoreDefaults()">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 0.35rem;">
                <path d="M4 12C4 16.4 7.6 20 12 20C16.4 20 20 16.4 20 12" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
                <path d="M12 4C14.5 4 16.7 5.2 18 7M12 4V8M12 4L8 4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Load Suggested Categories
            </button>
            <button class="btn-secondary" onclick="CategoryManager.openCreateModal()">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 0.35rem;">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
              Create Custom Category
            </button>
          </div>
        </div>
      `;
      return;
    }

    let html = '';
    this.categories.forEach(cat => {
      const total = cat.total_tasks || 0;
      const completed = cat.completed_tasks || 0;
      const active = cat.active_tasks || 0;
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      const catIconSvg = CategoryManager.getCategoryIconSvg(cat.icon);

      html += `
        <div class="category-card" style="border-top: 4px solid ${cat.color};">
          <div>
            <div class="cat-card-header">
              <div class="cat-icon-name">
                <div class="cat-icon-badge" style="background: ${cat.color};">
                  ${catIconSvg}
                </div>
                <div>
                  <div class="cat-name">${this.escapeHtml(cat.name)}</div>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${total} total tasks</span>
                </div>
              </div>
              <div class="task-actions">
                <button class="btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.78rem; display: inline-flex; align-items: center; gap: 0.35rem;" title="Edit Category" onclick="CategoryManager.openEditModal(${cat.id})">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
                    <path d="M14.5 4.5L19.5 9.5L8 21H3V16L14.5 4.5Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>
                    <path d="M13 6L18 11" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
                  </svg>
                  Edit
                </button>
                <button class="btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.78rem; color: var(--priority-urgent); display: inline-flex; align-items: center; gap: 0.35rem;" title="Remove Category" onclick="CategoryManager.confirmDelete(${cat.id}, '${this.escapeHtml(cat.name)}')">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
                    <path d="M4 7H20" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
                    <path d="M6 7V19C6 20 7 21 8 21H16C17 21 18 20 18 19V7" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
                    <path d="M9 7V4C9 3.4 9.4 3 10 3H14C14.6 3 15 3.4 15 4V7" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
                    <path d="M10 11V17M14 11V17" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
                  </svg>
                  Remove
                </button>
              </div>
            </div>

            <div class="cat-stats-row">
              <div class="cat-progress-text">
                <span>Completion Progress</span>
                <span>${pct}% (${completed}/${total})</span>
              </div>
              <div class="prod-progress-bar">
                <div class="prod-progress-fill" style="width: ${pct}%; background: ${cat.color};"></div>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; color: var(--text-subtle); padding-top: 0.85rem; border-top: 1px solid var(--border-color);">
            <span><strong style="color: var(--text-main);">${active}</strong> Active Tasks</span>
            <button class="btn-secondary" style="padding: 0.3rem 0.75rem; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.4rem;" onclick="CategoryManager.viewCategoryTasks(${cat.id})">
              Filter Tasks
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;
  },

  selectCategory(catId) {
    SoundEngine.playClick();
    this.selectedCategoryId = catId;
    this.renderSidebarCategories();
    this.renderTaskFilterChips();

    // Switch to tasks view if not already there
    App.switchView('tasks');
    TaskManager.currentFilters.category_id = catId;
    TaskManager.loadTasks();
  },

  viewCategoryTasks(catId) {
    this.selectCategory(String(catId));
  },

  openCreateModal() {
    SoundEngine.playClick();
    const form = document.getElementById('category-form');
    form.reset();
    document.getElementById('category-id').value = '';
    document.getElementById('category-modal-title').textContent = 'New Category';

    this.setColorActive('#6366f1');
    this.setIconActive('fa-tag');

    App.openModal('category-modal');
  },

  openEditModal(catId) {
    SoundEngine.playClick();
    const cat = this.categories.find(c => c.id === catId);
    if (!cat) return;

    document.getElementById('category-id').value = cat.id;
    document.getElementById('category-input-name').value = cat.name;
    document.getElementById('category-modal-title').textContent = 'Edit Category';

    this.setColorActive(cat.color);
    this.setIconActive(cat.icon);

    App.openModal('category-modal');
  },

  setColorActive(color) {
    document.getElementById('category-input-color').value = color;
    document.querySelectorAll('#category-color-presets .color-dot-btn').forEach(btn => {
      if (btn.dataset.color.toLowerCase() === color.toLowerCase()) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  },

  setIconActive(icon) {
    document.getElementById('category-input-icon').value = icon;
    document.querySelectorAll('#category-icon-presets .icon-preset-btn').forEach(btn => {
      if (btn.dataset.icon === icon) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  },

  confirmDelete(catId, catName) {
    App.openConfirmModal({
      title: `Remove Category "${catName}"?`,
      message: 'Tasks inside this category will remain completely safe and become Uncategorized (No Category).',
      actionText: 'Remove Category',
      onConfirm: async () => {
        const res = await API.categories.delete(catId);
        if (res.success) {
          API.showToast(res.message || 'Category removed', 'success');
          if (this.selectedCategoryId === String(catId)) {
            this.selectedCategoryId = '';
            TaskManager.currentFilters.category_id = '';
          }
          await this.loadCategories();
          TaskManager.loadTasks();
          Dashboard.loadStats();
        } else {
          API.showToast(res.message || 'Failed to remove category', 'error');
        }
      }
    });
  },

  confirmRemoveAll() {
    App.openConfirmModal({
      title: 'Remove All Categories?',
      message: 'All your current categories will be removed. All of your existing tasks will remain safe as Uncategorized.',
      actionText: 'Remove All Categories',
      onConfirm: async () => {
        const res = await API.categories.removeAll();
        if (res.success) {
          API.showToast('All categories removed', 'success');
          this.selectedCategoryId = '';
          TaskManager.currentFilters.category_id = '';
          await this.loadCategories();
          TaskManager.loadTasks();
          Dashboard.loadStats();
        } else {
          API.showToast(res.message || 'Operation failed', 'error');
        }
      }
    });
  },

  async restoreDefaults() {
    SoundEngine.playClick();
    const res = await API.categories.restoreDefaults();
    if (res.success) {
      API.showToast('Suggested categories restored!', 'success');
      await this.loadCategories();
      TaskManager.loadTasks();
      Dashboard.loadStats();
    } else {
      API.showToast(res.message || 'Failed to restore default categories', 'error');
    }
  },

  bindEvents() {
    const form = document.getElementById('category-form');
    const newBtn = document.getElementById('categories-btn-new');
    const quickAddSidebarBtn = document.getElementById('btn-quick-add-category');
    const removeAllBtn = document.getElementById('categories-btn-remove-all');
    const restoreDefaultsBtn = document.getElementById('categories-btn-restore-defaults');

    if (newBtn) newBtn.addEventListener('click', () => this.openCreateModal());
    if (quickAddSidebarBtn) quickAddSidebarBtn.addEventListener('click', () => this.openCreateModal());
    if (removeAllBtn) removeAllBtn.addEventListener('click', () => this.confirmRemoveAll());
    if (restoreDefaultsBtn) restoreDefaultsBtn.addEventListener('click', () => this.restoreDefaults());

    // Color presets click
    document.querySelectorAll('#category-color-presets .color-dot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setColorActive(btn.dataset.color);
      });
    });

    // Icon presets click
    document.querySelectorAll('#category-icon-presets .icon-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setIconActive(btn.dataset.icon);
      });
    });

    // Form submit
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const catId = document.getElementById('category-id').value;
        const name = document.getElementById('category-input-name').value.trim();
        const color = document.getElementById('category-input-color').value;
        const icon = document.getElementById('category-input-icon').value;

        if (!name) return;

        let res;
        if (catId) {
          res = await API.categories.update(catId, { name, color, icon });
        } else {
          res = await API.categories.create({ name, color, icon });
        }

        if (res.success) {
          API.showToast(catId ? 'Category updated!' : 'Category created!', 'success');
          App.closeModal('category-modal');
          await this.loadCategories();
          TaskManager.loadTasks();
          Dashboard.loadStats();
        } else {
          API.showToast(res.message || 'Operation failed', 'error');
        }
      });
    }
  },

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
};
