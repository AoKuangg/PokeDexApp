import React, { useEffect } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SearchBar from "../components/SearchBar";
import TypeFilter from "../components/TypeFilter";
import PokemonList from "../components/PokemonList";
import { usePokemonStore } from "../store/pokemonStore";

const HomeScreen = ({ navigation }) => {
  const {
    pokemonList,
    loading,
    error,
    fetchPokemonList,
    loadFavorites,
    clearError,
    fetchAllPokemonNames,
    allPokemonNames,
    allPokemonNamesLoading,
    allPokemonNamesError,
  } = usePokemonStore();

  useEffect(() => {
    loadFavorites();
    if (pokemonList.length === 0) {
      fetchPokemonList();
    }
    if (allPokemonNames.length === 0 && !allPokemonNamesLoading) {
      fetchAllPokemonNames();
    }
  }, []);
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [
        {
          text: "Reintentar",
          onPress: () => {
            clearError();
            fetchPokemonList();
          },
        },
        {
          text: "OK",
          onPress: clearError,
        },
      ]);
    }
  }, [error]);

  const handlePokemonPress = (pokemon) => {
    navigation.navigate("PokemonDetail", {
      pokemonId: pokemon.id,
      pokemonName: pokemon.name,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.content}>
        <SearchBar />
        <TypeFilter />
        <PokemonList onPokemonPress={handlePokemonPress} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
  },
});

export default HomeScreen;
