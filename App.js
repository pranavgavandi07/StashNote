import { PaperProvider } from 'react-native-paper';

import HomeScreen from './src/screens/HomeScreen';

function App() {
  return (
    <PaperProvider>
      <HomeScreen />
    </PaperProvider>
  );
}

export default App;