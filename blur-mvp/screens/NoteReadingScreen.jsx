import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditIconSVG from '../components/EditIconSVG';

export default function NoteReadingScreen({ navigation, route }) {
  const { note } = route.params;

  const deleteNote = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@notes');
      let notes = jsonValue != null ? JSON.parse(jsonValue) : [];
      notes = notes.filter(n => n.id !== note.id);
      await AsyncStorage.setItem('@notes', JSON.stringify(notes));
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error deleting note');
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={deleteNote} style={{ marginRight: 10 }}>
          <Text style={{ color: '#D4D7D7', fontSize: 16 }}>Delete</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.noteText}>{note.content}</Text>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Editor', { note })}
      >
        <Text style={styles.fabIcon}>
          <EditIconSVG/>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  noteText: {
    color: '#D4D7D7',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#D4D7D7',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabIcon: {
    fontSize: 24,
    color: '#D4D7D7',
  },
});
