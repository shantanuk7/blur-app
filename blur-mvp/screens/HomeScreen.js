import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const isFocused = useIsFocused();

  // Load notes from AsyncStorage
  const loadNotes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@notes');
      const savedNotes = jsonValue != null ? JSON.parse(jsonValue) : [];
      setNotes(savedNotes);
    } catch (e) {
      console.error('Failed to load notes.');
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadNotes();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.noteItem}
      onPress={() => navigation.navigate('Reading', { note: item })}
    >
      <Text style={styles.noteText} numberOfLines={1}>{item.content || 'Untitled Note'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {notes.length === 0 ? (
        <Text style={styles.emptyText}>No notes yet</Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Editor', { note: null })}
      >
        <Text style={styles.fabText}>＋</Text>
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
  noteItem: {
    backgroundColor: '#121212',
    borderColor: "#D4D7D7",
    borderWidth:1,
    padding: 16,
    marginBottom: 7,
    borderRadius: 8,
  },
  noteText: {
    color: '#D4D7D7',
    fontSize: 16,
  },
  emptyText: {
    color: '#D4D7D7',
    textAlign: 'center',
    marginTop: 20,
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
  },
  fabText: {
    color: '#121212',
    fontSize: 40,
    marginBottom:3
  },
});
