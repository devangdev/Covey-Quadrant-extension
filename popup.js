document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const themeToggle = document.getElementById('theme-toggle');
  
  const lists = {
    'q1': document.getElementById('list-q1'),
    'q2': document.getElementById('list-q2'),
    'q3': document.getElementById('list-q3'),
    'q4': document.getElementById('list-q4'),
    'plate': document.getElementById('list-plate')
  };

  // State array to hold tasks. Example shape: { id: '_xyz', text: 'Task 1', location: 'q1' }
  let tasks = [];

  // Load state from local storage securely
  chrome.storage.local.get(['coveyTasks', 'coveyDarkMode'], (result) => {
    if (result.coveyDarkMode) {
      document.body.classList.add('dark-mode');
      themeToggle.textContent = '☀️';
    }
    
    if (result.coveyTasks) {
      tasks = result.coveyTasks;
      renderAllTasks();
    }
  });

  // Handle Theme Toggle
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    chrome.storage.local.set({ coveyDarkMode: isDark });
  });

  // Save state to local storage
  function saveTasks() {
    chrome.storage.local.set({ coveyTasks: tasks });
  }

  // Quick ID generator
  function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  // Clear UI and render everything from scratch
  function renderAllTasks() {
    Object.values(lists).forEach(list => list.innerHTML = '');
    
    tasks.forEach(task => {
      const el = createTaskElement(task);
      if (lists[task.location]) {
        lists[task.location].appendChild(el);
      } else {
        // Fallback to center plate if something corrupts the location
        lists['plate'].appendChild(el);
        task.location = 'plate';
      }
    });
    // In case there was a fallback, save
    saveTasks();
  }

  // Construct a task DOM element
  function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = 'task';
    div.draggable = true;
    div.dataset.id = task.id;

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    const btn = document.createElement('button');
    btn.className = 'delete-btn';
    btn.innerHTML = '&times;';
    btn.title = "Delete task";
    btn.onclick = (e) => {
      e.stopPropagation();
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      div.remove();
    };

    div.appendChild(span);
    div.appendChild(btn);

    // Native Drag and Drop API events
    div.addEventListener('dragstart', (e) => {
      div.classList.add('dragging');
      // Set data payload to the task ID
      e.dataTransfer.setData('text/plain', task.id);
      e.dataTransfer.effectAllowed = 'move';
    });

    div.addEventListener('dragend', () => {
      div.classList.remove('dragging');
      // Revert styles on all potential drop zones in case of cancelled drag
      document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    });

    return div;
  }

  // Handle task submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    const newTask = {
      id: generateId(),
      text: text,
      location: 'plate' // Always starts on plate
    };

    tasks.push(newTask);
    saveTasks();
    
    // Add directly to UI (more efficient than re-rendering all)
    lists['plate'].appendChild(createTaskElement(newTask));
    input.value = '';
    // Optional: make list scroll to bottom if there are many tasks
    lists['plate'].scrollTop = lists['plate'].scrollHeight;
  });

  // Setup quadrant & plate areas as drop zones
  const dropZones = document.querySelectorAll('.quadrant, .center-plate');
  
  dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault(); // Necessary to allow dropping
      e.dataTransfer.dropEffect = 'move';
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      
      const taskId = e.dataTransfer.getData('text/plain');
      const targetLocation = zone.dataset.quadrant;
      
      if (!taskId || !targetLocation) return;
      
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex].location = targetLocation;
        saveTasks();
        
        // Find the node and move it in DOM natively
        const taskEl = document.querySelector(`.task[data-id="${taskId}"]`);
        if (taskEl) {
          lists[targetLocation].appendChild(taskEl);
        }
      }
    });
  });
});
