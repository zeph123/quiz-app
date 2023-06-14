
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { URL } from '../constants/requestParams';
import { CustomButton, TopBar, QuizItem } from '../components';

const StartActivity = (props) => {

  const [quizzes, setQuizzes] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const fetchGetAllQuizzes = async () => {
    const endpoint = '/quizzes';
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
        setQuizzes(responseData.data);
        setLoaded(true);
      })
      .catch( (error) => {
        console.log(error);
        setLoaded(true);
      });
  };

  async function fetchAddQuiz( formData ) {
    const endpoint = '/quizzes';
    const httpMethod = 'POST';
    const bodyData = JSON.stringify(formData);
    await fetch(URL + endpoint, {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyData,
    })
      .then( async (response) => {
        const responseData = await response.json();
        // console.log(responseData);
        if (responseData.statusCode >= 400 && responseData.statusCode < 600) {
          throw new Error(`${responseData.message}.`);
        }
        setLoaded(false);
        await fetchGetAllQuizzes();
        props.navigation.popToTop();
        Alert.alert('Sukces',responseData.message);
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  async function fetchDeleteQuizById( quizId ) {
    const endpoint = `/quizzes/${quizId}`;
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
        await fetchGetAllQuizzes();
      })
      .catch( (error) => {
        console.log(error);
      });
  }

  useEffect( () => {
    fetchGetAllQuizzes()
      .then( async (response) => {
        const responseData = await response.json();
        // console.log(responseData);
        if (responseData.statusCode >= 400 && responseData.statusCode < 600) {
          throw new Error(`${responseData.message}.`);
        }
        setQuizzes(responseData.data);
        setLoaded(true);
      })
      .catch( (error) => {
        console.log(error);
        setLoaded(true);
      });
  }, []);

  return (
    <View style={styles.container}>
      <TopBar
        applicationName={'QuizApp'}
      />
      <View style={styles.mainContent}>
        <ScrollView contentContainerStyle={styles.containerScrollView}>
          { loaded !== false ?
            (
              quizzes.length > 0 ? (
                quizzes.map((quiz, index) => {
                  return (
                    <QuizItem
                      key={index}
                      quiz={quiz}
                      fetchDeleteQuizById={fetchDeleteQuizById}
                      fetchGetAllQuizzes={fetchGetAllQuizzes}
                      navigation={props.navigation}
                    />
                  );
                })
              )
              : (
                <Text style={styles.textInformation}> Nie dodano jeszcze żadnych quizów. </Text>
              )
            ) :
            (
              <View style={styles.loadingScreen}>
                <ActivityIndicator size={100} color={styles.loadingIndicator.color} />
                <Text style={styles.loadingInfo}> Proszę czekać, trwa ładowanie Quizów. </Text>
              </View>
            )
          }
        </ScrollView>
      </View>
      <View style={styles.bottomBar}>
        <CustomButton
          text={'+'}
          onPress={() => props.navigation.navigate('AddQuizActivity', {
            fetchAddQuiz: fetchAddQuiz,
            navigation: props.navigation,
          })}
          styleButton={styles.buttonAddQuiz}
          styleButtonText={styles.buttonAddQuizText}
        />
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
    paddingRight: 20,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  buttonAddQuiz: {
    backgroundColor: 'black',
    width: 42,
    height: 42,
  },
  buttonAddQuizText: {
    color: 'white',
    fontSize: 24,
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
    color: 'rgb(0, 100, 255)',
  },
  loadingInfo: {
    marginTop: 10,
    marginHorizontal: 10,
    fontSize: 18,
    color: 'black',
  },
});

export default StartActivity;
