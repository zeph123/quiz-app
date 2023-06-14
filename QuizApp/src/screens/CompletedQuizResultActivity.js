
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, StyleSheet, Text, View } from 'react-native';
import { CustomButton, TopBar } from '../components';
import { URL } from '../constants/requestParams';

const CompletedQuizResultActivity = (props) => {

  const {quizId, navigation} = props.route.params;

  const [lastQuizAttempt, setLastQuizAttempt] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const fetchGetLastQuizAttemptByQuiz = async ( id ) => {
    const endpoint = `/quizAttempt/${id}`;
    const httpMethod = 'GET';
    await fetch(URL + endpoint, {
      method: httpMethod,
    })
      .then( async (response) => {
        const responseData = await response.json();
        // console.log(responseData);
        if (responseData.statusCode >= 400 && responseData.statusCode < 600) {
          throw new Error(`${responseData.message}.`);
        }
        setLastQuizAttempt(responseData.data);
        setLoaded(true);
      })
      .catch( (error) => {
        console.log(error);
      });
  };

  useEffect(() => {

    fetchGetLastQuizAttemptByQuiz(quizId)
      .then( async (response) => {
        const responseData = await response.json();
        // console.log(responseData);
        if (responseData.statusCode >= 400 && responseData.statusCode < 600) {
          throw new Error(`${responseData.message}.`);
        }
        setLastQuizAttempt(responseData.data);
        setLoaded(true);
      })
      .catch( (error) => {
        console.log(error);
      });

    const backToStartActivity = () => {
      Alert.alert('Uwaga !', 'Czy na pewno chcesz wrócić do ekranu startowego?', [
        { text: 'Anuluj', onPress: () => null, style: 'cancel' },
        { text: 'Tak', onPress: () => navigation.popToTop() },
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backToStartActivity,);
    return () => backHandler.remove();

  }, [navigation, quizId]);

  return (
    <View style={styles.container}>
      <TopBar
        applicationName={'QuizApp'}
      />
      <View style={styles.mainContent}>
        <View style={styles.container2}>

          {loaded !== false ?
            (
              <View style={styles.container3}>

                <View style={styles.containerTitle}>
                  <Text style={styles.formTitle}>Wyniki Quizu</Text>
                </View>

                <View style={styles.containerInformation}>
                  <View style={styles.infoGroup}>
                    <Text style={styles.textInfo2}>Quiz: </Text>
                    <Text style={styles.textInfo}>"{lastQuizAttempt.quiz.name}"</Text>
                  </View>
                  <View style={styles.infoGroup2}>
                    <Text style={styles.textInfo2}>Podejście: </Text>
                    <Text style={styles.textInfo}>{lastQuizAttempt.attemptNumber}</Text>
                  </View>
                  <View style={styles.infoGroup}>
                    <Text style={styles.textInfo2}>Data podejścia: </Text>
                    <Text style={styles.textInfo}>{lastQuizAttempt.attemptDate}</Text>
                  </View>
                  <View style={styles.infoGroup2}>
                    <Text style={styles.textInfo2}>Zdobyte punkty: </Text>
                    <View style={styles.infoGroup3}>
                      <Text style={styles.textInfo}>{lastQuizAttempt.earnedScore}/</Text>
                      <Text style={styles.textInfo3}>{lastQuizAttempt.maxPoints} pkt</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.containerButtons}>
                  <View style={styles.buttonGroup}>
                    <CustomButton
                      text={'Wyświetl pełne podejście'}
                      onPress={() =>
                        navigation.navigate('QuizAttemptActivity', {
                          quizAttempt: lastQuizAttempt,
                          navigation: navigation,
                        })
                      }
                      styleButton={styles.buttonShowQuizAttempt}
                      styleButtonText={styles.buttonShowQuizAttemptText}
                    />
                  </View>
                  <View style={styles.buttonGroup}>
                    <CustomButton
                      text={'Rozwiąż ponownie'}
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
                  <View style={styles.buttonGroup}>
                  <CustomButton
                    text={'Wyświetl historię'}
                    onPress={() =>
                      navigation.replace('QuizAttemptsHistoryActivity', {
                        quizId: quizId,
                        navigation: navigation,
                      })
                    }
                    styleButton={styles.buttonShowHistoryQuiz}
                    styleButtonText={styles.buttonShowHistoryQuizText}
                  />
                  </View>
                </View>
              </View>
            ) :
            (
              <View style={styles.loadingScreen}>
                <ActivityIndicator size={styles.loadingIndicator.size} color={styles.loadingIndicator.color} />
                <Text style={styles.loadingInfo}> Proszę czekać, trwa ładowanie Quizu. </Text>
              </View>
            )
          }

        </View>
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
    flex: 8,
    backgroundColor: 'white',
    paddingTop: 10,
  },

  container2: {
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
  container3: {
    flex: 1,
    marginHorizontal: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  containerTitle: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderColor: 'black',
  },
  containerInformation: {
    flex: 4,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    width: '100%',
    backgroundColor: 'ghostwhite',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: 'black',
  },
  containerButtons: {
    flex: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    textDecorationLine: 'underline',
  },
  infoGroup: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
  infoGroup2: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
  infoGroup3: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  textInfo: {
    fontSize: 18,
    fontWeight: 'normal',
    color: 'dimgrey',
  },
  textInfo2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  textInfo3: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonGroup: {
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  buttonShowQuizAttempt: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    backgroundColor: 'dodgerblue',
    width: '100%',
    height: 50,
  },
  buttonShowQuizAttemptText: {
    color: 'white',
    fontSize: 14,
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
    fontSize: 14,
  },
  buttonShowHistoryQuiz: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    backgroundColor: 'whitesmoke',
    width: '100%',
    height: 50,
  },
  buttonShowHistoryQuizText: {
    color: 'black',
    fontSize: 14,
  },
});

export default CompletedQuizResultActivity;
