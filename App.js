import {PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';

import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
