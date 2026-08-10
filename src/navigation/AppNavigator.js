import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AddNoteScreen from '../screens/AddNoteScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="AddNote"
        component={AddNoteScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
