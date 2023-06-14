
import { ActivityIndicator, Alert, BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { QuizAttemptItem, CustomButton, TopBar } from '../components';
import { URL } from '../constants/requestParams';
import axios from 'axios';

const QuizAttemptsHistoryActivity = (props) => {

  const { quizId, navigation } = props.route.params;

  const [quizAttempts, setQuizAttempts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const fetchGetAllQuizAttemptsByQuiz = async ( id, attempts ) => {
    const endpoint = `/allQuizAttempts/${id}`;
    try {
      const response = await axios.get(URL + endpoint);
      const responseData = response.data;
      if (responseData.statusCode >= 400 && responseData.statusCode < 600) {
        throw new Error(`${responseData.message}.`);
      }
      setQuizAttempts(responseData.data);
      setLoaded(true);
    } catch (error) {
      console.log(error);
      if (attempts.length > 0) {
        setQuizAttempts([]);
      }
      setLoaded(true);
    }
  };

  async function fetchDeleteQuizAttemptById( id ) {
    const endpoint = `/quizAttempt/${id}`;
    const httpMethod = 'DELETE';
    await fetch(URL + endpoint, {
      method: httpMethod,
    })
      .then( async (response) => {
        const responseData = await response.json();
        // console.log(responseData);
        if (responseData.statusCode >= 400 && responseData.statusCode < 600) {
          throw new Error(`${responseData.message}.`);
        }
        Alert.alert('Sukces',responseData.message);
        setLoaded(false);
        await fetchGetAllQuizAttemptsByQuiz(quizId);
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  async function fetchDeleteAllQuizAttemptsByQuiz( id ) {
    const endpoint = `/allQuizAttempts/${id}`;
    const httpMethod = 'DELETE';
    await fetch(URL + endpoint, {
      method: httpMethod,
    })
      .then( async (response) => {
        const responseData = await response.json();
        // console.log(responseData);
        if (responseData.statusCode >= 400 && responseData.statusCode < 600) {
          throw new Error(`${responseData.message}.`);
        }
        Alert.alert('Sukces',responseData.message);
        setLoaded(false);
        await fetchGetAllQuizAttemptsByQuiz(quizId);
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  useEffect(() => {

    fetchGetAllQuizAttemptsByQuiz(quizId, quizAttempts);

    const backToStartActivity = () => {
      navigation.popToTop();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backToStartActivity);
    return () => backHandler.remove();

  }, [navigation, quizAttempts, quizId]);

  return (
    <View style={styles.container}>
      <TopBar
        applicationName={'QuizApp'}
      />
      <View style={styles.mainContent}>
        <ScrollView contentContainerStyle={styles.containerScrollView}>
          { loaded !== false ?
            (
              quizAttempts.length > 0 ? (
                  quizAttempts.map((quizAttempt, index) => {
                    return (
                      <QuizAttemptItem
                        key={index}
                        quizAttempt={quizAttempt}
                        fetchDeleteQuizAttemptById={fetchDeleteQuizAttemptById}
                        navigation={navigation}
                      />
                    );
                  })
                )
                : (
                  <Text style={styles.textInformation}> Nie dodano jeszcze żadnych rozwiązań do quizu. </Text>
                )
            ) :
            (
              <View style={styles.loadingScreen}>
                <ActivityIndicator size={styles.loadingIndicator.size} color={styles.loadingIndicator.color} />
                <Text style={styles.loadingInfo}> Proszę czekać, trwa ładowanie podejść do quizu. </Text>
              </View>
            )
          }
        </ScrollView>
      </View>
      <View style={styles.bottomBar}>
        { loaded !== false && quizAttempts.length > 0 ?
          (
          <View style={styles.buttonGroup}>
            <CustomButton
              text={'Wyczyść historię'}
              onPress={async () => {
                await fetchDeleteAllQuizAttemptsByQuiz( quizId );
              }}
              styleButton={styles.buttonDeleteHistory}
              styleButtonText={styles.buttonDeleteHistoryText}
            />
          </View>
          ) :
          (
          <View style={styles.buttonGroup}>
            <CustomButton
              text={'Rozwiąż quiz'}
              onPress={() =>
                navigation.navigate('SolveQuizActivity', {
                  quizId: quizId,
                  navigation: navigation,
                })
              }
              styleButton={styles.buttonSolveQuiz}
              styleButtonText={styles.buttonSolveQuizText}
            />
          </View>
          )
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  mainContent: {
    flex: 7,
    backgroundColor: 'white',
    paddingTop: 10,
  },
  bottomBar: {
    flex: 1,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  buttonGroup: {
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonDeleteHistory: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    backgroundColor: 'orangered',
    width: '100%',
    height: 50,
  },
  buttonDeleteHistoryText: {
    color: 'white',
    fontSize: 18,
  },
  buttonSolveQuiz: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    backgroundColor: 'limegreen',
    width: '100%',
    height: 50,
  },
  buttonSolveQuizText: {
    color: 'white',
    fontSize: 18,
  },
  textInformation: {
    marginTop: 10,
    marginHorizontal: 10,
    fontSize: 18,
    color: 'black',
  },
  containerScrollView: {
    marginHorizontal: 10,
    flexGrow: 1,
  },
  loadingScreen: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },
  loadingIndicator: {
    size: 100,
    color: 'rgb(0, 100, 255)',
  },
  loadingInfo: {
    marginTop: 10,
    marginHorizontal: 10,
    fontSize: 18,
    color: 'black',
  },
});

export default QuizAttemptsHistoryActivity;
