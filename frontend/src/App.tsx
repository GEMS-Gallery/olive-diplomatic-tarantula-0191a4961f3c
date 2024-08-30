import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, List, ListItem, ListItemIcon, ListItemText, Checkbox, LinearProgress, TextField, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: 'var(--card-color)',
  borderRadius: 'var(--border-radius)',
  boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
}));

const Header = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '2rem',
});

const ProfilePic = styled('img')({
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginRight: '1rem',
});

const TaskItem = styled(ListItem)({
  backgroundColor: '#f7fafc',
  borderRadius: 'var(--border-radius)',
  marginBottom: '1rem',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
  },
});

const Celebration = styled('div')(({ show }: { show: boolean }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  zIndex: 1000,
  opacity: show ? 1 : 0,
  pointerEvents: show ? 'auto' : 'none',
  transition: 'opacity 0.3s ease',
}));

const App: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await backend.getTasks();
      setTasks(fetchedTasks);
      updateProgress();
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    setLoading(false);
  };

  const updateProgress = async () => {
    try {
      const currentProgress = await backend.getProgress();
      setProgress(currentProgress);
      if (currentProgress.completed === currentProgress.total && currentProgress.total > 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleToggleTask = async (id: number) => {
    setLoading(true);
    try {
      const result = await backend.toggleTask(id);
      if ('ok' in result) {
        setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
        updateProgress();
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
    setLoading(false);
  };

  const handleAddTask = async () => {
    if (newTask.trim()) {
      setLoading(true);
      try {
        const result = await backend.addTask(newTask, '✨');
        if ('ok' in result) {
          setTasks([...tasks, result.ok]);
          setNewTask('');
          updateProgress();
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
      setLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="sm">
      <Header>
        <ProfilePic src="/api/placeholder/60/60" alt="Profile Picture" />
        <div>
          <Typography variant="h4">Hi, Jack!</Typography>
          <Typography variant="subtitle1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
        </div>
      </Header>

      {loading && <CircularProgress />}

      <List>
        {tasks.map((task) => (
          <TaskItem key={task.id}>
            <ListItemIcon>{task.icon}</ListItemIcon>
            <ListItemText primary={task.text} />
            <Checkbox
              edge="end"
              checked={task.completed}
              onChange={() => handleToggleTask(task.id)}
            />
          </TaskItem>
        ))}
      </List>

      <LinearProgress
        variant="determinate"
        value={(progress.completed / progress.total) * 100 || 0}
        sx={{ marginBottom: 2 }}
      />
      <Typography variant="body2" align="center">
        {progress.completed} of {progress.total} tasks completed
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Add a new task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        sx={{ marginTop: 2 }}
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleAddTask}
        sx={{ marginTop: 2 }}
      >
        Add Task
      </Button>

      <Celebration show={showCelebration}>
        <div>
          <span style={{ fontSize: '5rem' }}>🎉</span>
          <span style={{ fontSize: '5rem' }}>🎊</span>
          <span style={{ fontSize: '5rem' }}>🚀</span>
          <Typography variant="h2" style={{ color: 'white' }}>All tasks completed!</Typography>
          <Typography variant="h4" style={{ color: 'white' }}>You're a chore champion, Jack!</Typography>
        </div>
      </Celebration>
    </StyledContainer>
  );
};

export default App;
