import { ScrollView, View } from 'react-native';
import { Appbar, Button, Text, TextInput } from 'react-native-paper';

function AddNoteScreen({ navigation }) {
    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Add Note" />
            </Appbar.Header>

            <ScrollView
                contentContainerStyle={{
                    padding: 16,
                }}>
                <Text variant="headlineSmall" style={{ marginBottom: 20 }}>
                    Create a new note
                </Text>

                <TextInput
                    label="Title"
                    mode="outlined"
                    placeholder="Enter note title"
                    style={{ marginBottom: 16 }}
                />

                <TextInput
                    label="Content"
                    mode="outlined"
                    placeholder="Write your note..."
                    multiline
                    numberOfLines={8}
                    style={{ marginBottom: 20 }}
                />

                <Button mode="contained" icon="content-save" onPress={() => { }}>
                    Save Note
                </Button>
            </ScrollView>
        </View>
    );
}

export default AddNoteScreen;