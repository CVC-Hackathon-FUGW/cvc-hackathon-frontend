import { AppShell } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';
import MyHeader from './components/common/Header';
import router from './routes';

function App() {
  return (
    <AppShell padding="md" header={<MyHeader />}>
      <RouterProvider router={router} />
    </AppShell>
  );
}

export default App;
