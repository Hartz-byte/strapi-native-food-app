import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ViewScreen({ route, navigation }) {
  const { recipe1 } = route.params;
  let [recipe, setRecipe] = useState(null);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const response = await fetch(
          `http://192.168.29.24:1337/api/products/${recipe1}?populate=*`
        );
        const data = await response.json();
        if (data && data.data) {
          // console.log("attributes data: ", data.data.attributes);
          setRecipe(data.data.attributes);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    }

    fetchRecipe();
  }, [recipe1]);

  // Function to handle adding the recipe to the cart
  const handleAddToCart = async () => {
    console.log("recipe1: ", recipe1);
    if (recipe) {
      const userid = await AsyncStorage.getItem("userid");
      console.log("userid: ", userid);

      let payload = {
        data: {
          productid: recipe1,
          userid: userid,
        },
      };
      let data = payload.data;
      console.log("payload: ", payload);
      console.log("recipe: ", recipe);

      try {
        const response = await fetch("http://192.168.29.24:1337/api/carts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: data }),
        });
        console.log("response: " + JSON.stringify(response));

        if (response.ok) {
          alert(`Added "${recipe.productname}" to the cart`);
          navigation.navigate("Main");
        } else {
          console.error("Error adding to cart. Please try again.");
        }
      } catch (error) {
        console.error("Error adding to cart: ", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {recipe ? (
        <React.Fragment>
          <Text style={styles.recipeName}>{recipe.productname}</Text>
          <Text style={styles.recipePrice}>Price: ${recipe.price}</Text>
        </React.Fragment>
      ) : (
        <Text>Loading...</Text>
      )}

      {/* Add to Cart Button */}
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={handleAddToCart}
      >
        <FontAwesome name="shopping-cart" size={24} color="white" />
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>

      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    marginTop: 100,
  },
  recipeImage: {
    width: 200,
    height: 150,
    marginBottom: 10,
    borderRadius: 20,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recipePrice: {
    fontSize: 16,
    marginBottom: 10,
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addToCartButtonText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
});
