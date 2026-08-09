import { View } from 'react-native';
import {
  Appbar,
  Button,
  Card,
  Searchbar,
  Text,
} from 'react-native-paper';

function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="StashNote" />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <Text variant="headlineSmall">Capture it. Find it.</Text>

        <Text
          variant="bodyMedium"
          style={{ marginTop: 8, marginBottom: 20 }}>
          Keep your important thoughts, ideas and reminders in one place.
        </Text>

        <Searchbar
          placeholder="Search your notes"
          style={{ marginBottom: 24 }}
        />

        <Text variant="titleLarge" style={{ marginBottom: 12 }}>
          Your notes
        </Text>

        <Card mode="outlined">
          <Card.Content>
            <Text variant="titleMedium">No notes yet</Text>

            <Text variant="bodyMedium" style={{ marginTop: 6 }}>
              Create your first note and start building your personal stash.
            </Text>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          icon="plus"
          style={{ marginTop: 20 }}
          onPress={() => { }}>
          Add your first note
        </Button>
      </View>
    </View>
  );
}

export default HomeScreen;