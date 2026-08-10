import {createNativeStackNavigator} from '@react-navigation/native-stack';

import AddNoteScreen from '../screens/AddNoteScreen';
import EditNoteScreen from '../screens/EditNoteScreen';
import HomeScreen from '../screens/HomeScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';

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

      <Stack.Screen
        name="NoteDetail"
        component={NoteDetailScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="EditNote"
        component={EditNoteScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;