
import React from 'react';
import {
  SafeAreaView, StatusBar, StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  AddQuizActivity,
  CompletedQuizResultActivity,
  EditQuizActivity,
  QuizAttemptsHistoryActivity,
  SolveQuizActivity,
  StartActivity,
  QuizAttemptActivity,
} from './screens';

const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor={'white'}
        barStyle={'dark-content'}
        showHideTransition={'slide'}
        hidden={false} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="StartActivity">
          <Stack.Screen
            name="StartActivity"
            component={StartActivity}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddQuizActivity"
            component={AddQuizActivity}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="EditQuizActivity"
            component={EditQuizActivity}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SolveQuizActivity"
            component={SolveQuizActivity}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CompletedQuizResultActivity"
            component={CompletedQuizResultActivity}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="QuizAttemptsHistoryActivity"
            component={QuizAttemptsHistoryActivity}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="QuizAttemptActivity"
            component={QuizAttemptActivity}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
