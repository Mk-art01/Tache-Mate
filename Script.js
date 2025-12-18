let tasks = [];

function startApp() {
  document.querySelector('.btn-start').style.display = 'none';
  document.querySelector('.app-content').style.display = 'block';
  Notification.requestPermission();
}

function updateClock() {
  const now = new Date();
  document.querySelector('.clock').textContent = now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();

function loadTasks() {
  const date = document.getElementById('date-picker').value;
  const container = document.getElementById('tasks-container');
  container.innerHTML = '';
  tasks.filter(t => t.date === date).forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${task.text} (${task.time})</span>
      <input type="checkbox" onchange="toggleDone(${task.id})" ${task.status==='fait'?'checked':''}>
      <select onchange="updateStatus(${task.id}, this.value)">
        <option value="à faire" ${task.status==='à faire'?'selected':''}>à faire</option>
        <option value="en cours" ${task.status==='en cours'?'selected':''}>en cours</option>
        <option value="fait" ${task.status==='fait'?'selected':''}>fait</option>
      </select>
    `;
    container.appendChild(li);
  });
}

function addTask() {
  const task = {
    id: Date.now(),
    text: document.getElementById('new-task').value,
    date: document.getElementById('date-picker').value,
    time: document.getElementById('task-time').value,
    status: 'à faire'
  };
  tasks.push(task);
  loadTasks();
  document.getElementById('new-task').value = '';
  document.getElementById('task-time').value = '';
}

function updateStatus(id, status) {
  tasks = tasks.map(t => t.id === id ? { ...t, status } : t);
  loadTasks();
}

function toggleDone(id) {
  tasks = tasks.map(t => 
    t.id === id ? { ...t, status: t.status==='fait' ? 'à faire' : 'fait' } : t
  );
  loadTasks();
}

function checkTasks() {
  const now = new Date();
  tasks.forEach(task => {
    if (task.status === 'à faire' && now >= new Date(`${task.date}T${task.time}`)) {
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]); // Vibration + son système
      }
      new Notification(`⏰ ${task.text} commence maintenant !`);
      task.status = 'en cours';
      loadTasks();
    }
  });
}

setInterval(checkTasks, 1000);
