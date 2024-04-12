import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { theme } from './colors';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';

export default function App() {
  const [selectedMenu, setMenu] = useState('Work');
  const [text, setText] = useState('');
  const [todos, setTodos] = useState({});
  const [travels, setTravels] = useState({});

  useEffect(() => {
    loadStorageData();
  }, []);

  const handleMenu = (menu) => {
    setMenu(menu);
  };

  const loadStorageData = async () => {
    try {
      const loadedWorks = await AsyncStorage.getItem('works');
      const loadedTravels = await AsyncStorage.getItem('travels');

      if (loadedWorks !== null) {
        setTodos(JSON.parse(loadedWorks));
      }
      if (loadedTravels !== null) {
        setTravels(JSON.parse(loadedTravels));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveInStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  const addTodo = () => {
    if (text === '') return;
    const id = Date.now().toString();
    const newTodo = { ...todos, [id]: text };

    if (selectedMenu === 'Work') {
      setTodos(newTodo);
      saveInStorage('works', newTodo);
    } else {
      const newTravel = { ...travels, [id]: text };
      setTravels(newTravel);
      saveInStorage('travels', newTravel);
    }
    setText('');
  };

  const deleteTodo = async (id) => {
    Alert.alert('DELETE', '정말 삭제할까요?', [
      { text: 'Cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          if (selectedMenu === 'Work') {
            const newTodos = { ...todos };
            delete newTodos[id];
            setTodos(newTodos);
            saveInStorage('works', newTodos);
          } else {
            const newTravels = { ...travels };
            delete newTravels[id];
            setTravels(newTravels);
            saveInStorage('travels', newTravels);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleMenu('Work')}>
          <Text style={{ ...styles.btnText, color: selectedMenu === 'Work' ? theme.white : theme.gray }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleMenu('Travel')}>
          <Text style={{ ...styles.btnText, color: selectedMenu === 'Travel' ? theme.white : theme.gray }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        returnKeyType="done"
        placeholder={selectedMenu === 'Work' ? '할 일을 추가하세요' : '어디에 가고 싶나요?'}
        onChangeText={setText}
        value={text}
        onSubmitEditing={addTodo}
      />

      <ScrollView>
        {selectedMenu === 'Work'
          ? Object.entries(todos).map(([id, todo]) => (
              <View style={styles.todo} key={id}>
                <Text style={styles.todoText}>{todo}</Text>
                <TouchableOpacity onPress={() => deleteTodo(id)}>
                  <Fontisto name="trash" size={17} color={theme.todoBg} />
                </TouchableOpacity>
              </View>
            ))
          : Object.entries(travels).map(([id, travel]) => (
              <View style={styles.todo} key={id}>
                <Text style={styles.todoText}>{travel}</Text>
                <TouchableOpacity onPress={() => deleteTodo(id)}>
                  <Fontisto name="trash" size={17} color={theme.todoBg} />
                </TouchableOpacity>
              </View>
            ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100,
  },

  btnText: {
    fontSize: 38,
    fontWeight: '600',
  },

  input: {
    backgroundColor: theme.white,
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginTop: 20,
    fontSize: 16,
    marginVertical: 20,
  },

  todo: {
    borderRadius: 10,
    backgroundColor: theme.gray,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  todoText: {
    color: theme.white,
    fontSize: 16,
    fontWeight: '500',
  },
});
