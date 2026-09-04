import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import TaskListScreen from '../screens/TaskListScreen';
import TaskCreateScreen from '../screens/TaskCreateScreen';
import TaskEditScreen from '../screens/TaskEditScreen';
import { colors } from '../utils/colors';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token, isLoading } = useAuth();

  // Tant que le token stocké dans AsyncStorage n'a pas été relu, on affiche un
  // loader plutôt qu'un flash de l'écran de login suivi d'une redirection.
  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: { color: colors.textPrimary },
          headerTintColor: colors.primary,
        }}
      >
        {token ? (
          // Utilisateur connecté : pile "tâches". Si le token expire en cours
          // de session, l'intercepteur Axios (voir api/axios.js) déclenche logout()
          // ce qui fait passer `token` à null et bascule automatiquement ici vers Login.
          <>
            <Stack.Screen name="TaskList" component={TaskListScreen} options={{ headerShown: false }} />
            <Stack.Screen name="TaskCreate" component={TaskCreateScreen} options={{ title: 'Nouvelle tâche' }} />
            <Stack.Screen name="TaskEdit" component={TaskEditScreen} options={{ title: 'Modifier la tâche' }} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
});
