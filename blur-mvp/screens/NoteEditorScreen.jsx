import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NoteEditorScreen({ navigation, route }) {
  // Use local state to hold content and note id.
  const [content, setContent] = useState(route.params?.note?.content || '');
  const [originalContent] = useState(content);
  const [noteId, setNoteId] = useState(route.params?.note?.id || null);
  // A ref to track if a save already occurred.
  const isSavedRef = useRef(false);

  // Save note function: if note exists, update it; otherwise, add a new note.
  const saveNote = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@notes');
      const notes = jsonValue != null ? JSON.parse(jsonValue) : [];
      let newNotes;
      if (noteId) {
        // Update the existing note.
        newNotes = notes.map(n => n.id === noteId ? { ...n, content } : n);
      } else {
        // Create a new note and update the noteId.
        const newNote = { id: Date.now(), content };
        newNotes = [...notes, newNote];
        setNoteId(newNote.id);
      }
      await AsyncStorage.setItem('@notes', JSON.stringify(newNotes));
      isSavedRef.current = true; // Mark as saved to prevent duplicate saving.
      return true;
    } catch (e) {
      Alert.alert('Error saving note');
      return false;
    }
  };

  // Save note on save button press.
  const onSave = async () => {
    await saveNote();
    navigation.goBack();
  };

  // Auto-save on back press if there are unsaved changes.
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async (e) => {
      // If content hasn't changed or already saved, let the default action happen.
      if (content === originalContent || isSavedRef.current) {
        return;
      }
      e.preventDefault(); // Prevent default back action.
      await saveNote();
      navigation.dispatch(e.data.action); // Proceed with navigation.
    });
    return unsubscribe;
  }, [navigation, content, originalContent]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onSave} style={{ marginRight: 10 }}>
          <Text style={{ color: '#D4D7D7', fontSize: 16 }}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, content]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="Write your note..."
        placeholderTextColor="#D4D7D7"
        value={content}
        onChangeText={setContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  textInput: {
    flex: 1,
    color: '#D4D7D7',
    fontSize: 16,
    textAlignVertical: 'top',
  },
});
