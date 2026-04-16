import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";
import Restaurant from "./models/Restaurant.js";
import MenuItem from "./models/MenuItem.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    const customer = await User.create({
      name: "John Customer",
      email: "customer@test.com",
      password: "password123",
      phone: "1234567890",
      role: "customer",
      addresses: [
        {
          label: "Home",
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          isDefault: true,
        },
      ],
    });

    const restaurantOwner = await User.create({
      name: "Restaurant Owner",
      email: "owner@test.com",
      password: "password123",
      phone: "0987654321",
      role: "restaurant",
    });

    const admin = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: "password123",
      role: "admin",
    });

    console.log("Created users");

    // Create restaurants
    const restaurant1 = await Restaurant.create({
      name: "Pizza Palace",
      description: "Authentic Italian pizza made with fresh ingredients",
      owner: restaurantOwner._id,
      location: {
        street: "456 Pizza Ave",
        city: "New York",
        state: "NY",
        zipCode: "10002",
      },
      cuisineType: ["Italian", "Pizza"],
      priceRange: "$$",
      openingHours: [
        { day: "Monday", open: "11:00", close: "22:00" },
        { day: "Tuesday", open: "11:00", close: "22:00" },
        { day: "Wednesday", open: "11:00", close: "22:00" },
        { day: "Thursday", open: "11:00", close: "22:00" },
        { day: "Friday", open: "11:00", close: "23:00" },
        { day: "Saturday", open: "11:00", close: "23:00" },
        { day: "Sunday", open: "12:00", close: "22:00" },
      ],
      images: [
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=600&fit=crop",
      ],
      rating: 4.5,
      totalReviews: 120,
      isActive: true,
    });

    const restaurant2 = await Restaurant.create({
      name: "Burger House",
      description: "Gourmet burgers and craft beers",
      owner: restaurantOwner._id,
      location: {
        street: "789 Burger Blvd",
        city: "New York",
        state: "NY",
        zipCode: "10003",
      },
      cuisineType: ["American", "Burgers"],
      priceRange: "$$",
      openingHours: [
        { day: "Monday", open: "10:00", close: "21:00" },
        { day: "Tuesday", open: "10:00", close: "21:00" },
        { day: "Wednesday", open: "10:00", close: "21:00" },
        { day: "Thursday", open: "10:00", close: "21:00" },
        { day: "Friday", open: "10:00", close: "22:00" },
        { day: "Saturday", open: "10:00", close: "22:00" },
        { day: "Sunday", open: "11:00", close: "21:00" },
      ],
      images: [
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551782450-17144efb5723?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop",
      ],
      rating: 4.3,
      totalReviews: 85,
      isActive: true,
    });

    const restaurant3 = await Restaurant.create({
      name: "Sushi Master",
      description: "Fresh sushi and Japanese cuisine",
      owner: restaurantOwner._id,
      location: {
        street: "321 Sushi St",
        city: "New York",
        state: "NY",
        zipCode: "10004",
      },
      cuisineType: ["Japanese", "Sushi"],
      priceRange: "$$$",
      openingHours: [
        { day: "Monday", open: "12:00", close: "22:00" },
        { day: "Tuesday", open: "12:00", close: "22:00" },
        { day: "Wednesday", open: "12:00", close: "22:00" },
        { day: "Thursday", open: "12:00", close: "22:00" },
        { day: "Friday", open: "12:00", close: "23:00" },
        { day: "Saturday", open: "12:00", close: "23:00" },
        { day: "Sunday", open: "12:00", close: "22:00" },
      ],
      images: [
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop",
      ],
      rating: 4.7,
      totalReviews: 200,
      isActive: true,
    });

    // Create additional sample restaurants
    const restaurant4 = await Restaurant.create({
      name: "Taco Fiesta",
      description: "Authentic Mexican street food and tacos",
      owner: restaurantOwner._id,
      location: {
        street: "555 Fiesta Blvd",
        city: "New York",
        state: "NY",
        zipCode: "10005",
      },
      cuisineType: ["Mexican", "Latin American"],
      priceRange: "$",
      openingHours: [
        { day: "Monday", open: "11:00", close: "23:00" },
        { day: "Tuesday", open: "11:00", close: "23:00" },
        { day: "Wednesday", open: "11:00", close: "23:00" },
        { day: "Thursday", open: "11:00", close: "23:00" },
        { day: "Friday", open: "11:00", close: "24:00" },
        { day: "Saturday", open: "11:00", close: "24:00" },
        { day: "Sunday", open: "12:00", close: "22:00" },
      ],
      images: [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&h=600&fit=crop",
      ],
      rating: 4.4,
      totalReviews: 95,
      isActive: true,
    });

    const restaurant5 = await Restaurant.create({
      name: "Golden Dragon",
      description: "Traditional Chinese cuisine with modern twists",
      owner: restaurantOwner._id,
      location: {
        street: "888 Dragon Way",
        city: "New York",
        state: "NY",
        zipCode: "10006",
      },
      cuisineType: ["Chinese", "Asian"],
      priceRange: "$$",
      openingHours: [
        { day: "Monday", open: "11:30", close: "22:30" },
        { day: "Tuesday", open: "11:30", close: "22:30" },
        { day: "Wednesday", open: "11:30", close: "22:30" },
        { day: "Thursday", open: "11:30", close: "22:30" },
        { day: "Friday", open: "11:30", close: "23:30" },
        { day: "Saturday", open: "11:30", close: "23:30" },
        { day: "Sunday", open: "12:00", close: "22:00" },
      ],
      images: [
        "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=800&h=600&fit=crop",
      ],
      rating: 4.2,
      totalReviews: 150,
      isActive: true,
    });

    const restaurant6 = await Restaurant.create({
      name: "Mediterranean Delight",
      description: "Fresh Mediterranean and Middle Eastern cuisine",
      owner: restaurantOwner._id,
      location: {
        street: "777 Olive Tree Ln",
        city: "New York",
        state: "NY",
        zipCode: "10007",
      },
      cuisineType: ["Mediterranean", "Middle Eastern"],
      priceRange: "$$",
      openingHours: [
        { day: "Monday", open: "11:00", close: "21:00" },
        { day: "Tuesday", open: "11:00", close: "21:00" },
        { day: "Wednesday", open: "11:00", close: "21:00" },
        { day: "Thursday", open: "11:00", close: "21:00" },
        { day: "Friday", open: "11:00", close: "22:00" },
        { day: "Saturday", open: "11:00", close: "22:00" },
        { day: "Sunday", open: "12:00", close: "21:00" },
      ],
      images: [
        "https://images.unsplash.com/photo-1544124499-58912cbddaad?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop",
      ],
      rating: 4.6,
      totalReviews: 110,
      isActive: true,
    });

    const restaurant7 = await Restaurant.create({
      name: "Vegan Paradise",
      description: "Plant-based cuisine that tastes amazing",
      owner: restaurantOwner._id,
      location: {
        street: "999 Green St",
        city: "New York",
        state: "NY",
        zipCode: "10008",
      },
      cuisineType: ["Vegan", "Healthy", "Vegetarian"],
      priceRange: "$$",
      openingHours: [
        { day: "Monday", open: "08:00", close: "20:00" },
        { day: "Tuesday", open: "08:00", close: "20:00" },
        { day: "Wednesday", open: "08:00", close: "20:00" },
        { day: "Thursday", open: "08:00", close: "20:00" },
        { day: "Friday", open: "08:00", close: "21:00" },
        { day: "Saturday", open: "09:00", close: "21:00" },
        { day: "Sunday", open: "10:00", close: "19:00" },
      ],
      images: [
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop",
      ],
      rating: 4.3,
      totalReviews: 75,
      isActive: true,
    });

    const restaurant8 = await Restaurant.create({
      name: "Pasta Bella",
      description: "Homemade pasta and authentic Italian dishes",
      owner: restaurantOwner._id,
      location: {
        street: "444 Pasta Ave",
        city: "New York",
        state: "NY",
        zipCode: "10009",
      },
      cuisineType: ["Italian", "Pasta"],
      priceRange: "$$$",
      openingHours: [
        { day: "Monday", open: "17:00", close: "23:00" },
        { day: "Tuesday", open: "17:00", close: "23:00" },
        { day: "Wednesday", open: "17:00", close: "23:00" },
        { day: "Thursday", open: "17:00", close: "23:00" },
        { day: "Friday", open: "17:00", close: "24:00" },
        { day: "Saturday", open: "17:00", close: "24:00" },
        { day: "Sunday", open: "17:00", close: "22:00" },
      ],
      images: [
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551892376-c73ba244bca8?w=800&h=600&fit=crop",
      ],
      rating: 4.8,
      totalReviews: 180,
      isActive: true,
    });

    console.log("Created restaurants");

    // Create menu items for Pizza Palace
    await MenuItem.create([
      {
        restaurant: restaurant1._id,
        name: "Margherita Pizza",
        description: "Classic pizza with tomato, mozzarella, and basil",
        category: "Main Course",
        price: 1079,
        isAvailable: true,
        isVegetarian: true,
        extras: [
          { name: "Extra Cheese", price: 166 },
          { name: "Olives", price: 125 },
        ],
      },
      {
        restaurant: restaurant1._id,
        name: "Pepperoni Pizza",
        description: "Loaded with pepperoni and cheese",
        category: "Main Course",
        price: 1244,
        isAvailable: true,
        extras: [
          { name: "Extra Pepperoni", price: 249 },
          { name: "Jalapeños", price: 83 },
        ],
      },
      {
        restaurant: restaurant1._id,
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with Caesar dressing",
        category: "Starters",
        price: 746,
        isAvailable: true,
        isVegetarian: true,
      },
      {
        restaurant: restaurant1._id,
        name: "Tiramisu",
        description: "Classic Italian dessert",
        category: "Desserts",
        price: 580,
        isAvailable: true,
        isVegetarian: true,
      },
    ]);

    // Create menu items for Burger House
    await MenuItem.create([
      {
        restaurant: restaurant2._id,
        name: "Classic Burger",
        description: "Beef patty with lettuce, tomato, and special sauce",
        category: "Main Course",
        price: 912,
        isAvailable: true,
        extras: [
          { name: "Bacon", price: 208 },
          { name: "Extra Patty", price: 332 },
          { name: "Cheese", price: 125 },
        ],
      },
      {
        restaurant: restaurant2._id,
        name: "Veggie Burger",
        description: "Plant-based patty with fresh vegetables",
        category: "Main Course",
        price: 995,
        isAvailable: true,
        isVegetarian: true,
        isVegan: true,
      },
      {
        restaurant: restaurant2._id,
        name: "French Fries",
        description: "Crispy golden fries",
        category: "Starters",
        price: 414,
        isAvailable: true,
        isVegetarian: true,
      },
      {
        restaurant: restaurant2._id,
        name: "Milkshake",
        description: "Creamy vanilla milkshake",
        category: "Drinks",
        price: 497,
        isAvailable: true,
        isVegetarian: true,
      },
    ]);

    // Create menu items for Sushi Master
    await MenuItem.create([
      {
        restaurant: restaurant3._id,
        name: "California Roll",
        description: "Crab, avocado, and cucumber",
        category: "Main Course",
        price: 746,
        isAvailable: true,
      },
      {
        restaurant: restaurant3._id,
        name: "Salmon Nigiri",
        description: "Fresh salmon over rice",
        category: "Main Course",
        price: 1079,
        isAvailable: true,
      },
      {
        restaurant: restaurant3._id,
        name: "Miso Soup",
        description: "Traditional Japanese soup",
        category: "Starters",
        price: 331,
        isAvailable: true,
        isVegetarian: true,
      },
      {
        restaurant: restaurant3._id,
        name: "Green Tea Ice Cream",
        description: "Authentic matcha ice cream",
        category: "Desserts",
        price: 497,
        isAvailable: true,
        isVegetarian: true,
      },
    ]);

    // Create menu items for Taco Fiesta
    await MenuItem.create([
      {
        restaurant: restaurant4._id,
        name: "Carne Asada Taco",
        description: "Grilled steak with onions and cilantro",
        category: "Main Course",
        price: 331,
        isAvailable: true,
        extras: [
          { name: "Extra Guacamole", price: 125 },
          { name: "Sour Cream", price: 62 },
        ],
      },
      {
        restaurant: restaurant4._id,
        name: "Fish Taco",
        description: "Beer-battered fish with cabbage slaw",
        category: "Main Course",
        price: 373,
        isAvailable: true,
      },
      {
        restaurant: restaurant4._id,
        name: "Quesadilla",
        description: "Cheese quesadilla with chicken",
        category: "Main Course",
        price: 746,
        isAvailable: true,
      },
      {
        restaurant: restaurant4._id,
        name: "Chips & Salsa",
        description: "Tortilla chips with fresh salsa",
        category: "Starters",
        price: 331,
        isAvailable: true,
        isVegetarian: true,
      },
      {
        restaurant: restaurant4._id,
        name: "Churros",
        description: "Cinnamon sugar churros",
        category: "Desserts",
        price: 414,
        isAvailable: true,
        isVegetarian: true,
      },
      {
        restaurant: restaurant4._id,
        name: "Horchata",
        description: "Sweet rice drink",
        category: "Drinks",
        price: 248,
        isAvailable: true,
        isVegetarian: true,
      },
    ]);

    // Create menu items for Golden Dragon
    await MenuItem.create([
      {
        restaurant: restaurant5._id,
        name: "Kung Pao Chicken",
        description: "Spicy chicken with peanuts and vegetables",
        category: "Main Course",
        price: 1161,
        isAvailable: true,
        extras: [
          { name: "Extra Spicy", price: 83 },
          { name: "White Rice", price: 166 },
        ],
      },
      {
        restaurant: restaurant5._id,
        name: "Vegetable Lo Mein",
        description: "Stir-fried noodles with mixed vegetables",
        category: "Main Course",
        price: 912,
        isAvailable: true,
        isVegetarian: true,
      },
      {
        restaurant: restaurant5._id,
        name: "Spring Rolls",
        description: "Crispy vegetable spring rolls",
        category: "Starters",
        price: 497,
        isAvailable: true,
        isVegetarian: true,
      },
      {
        restaurant: restaurant5._id,
        name: "Fried Rice",
        description: "Classic Chinese fried rice with vegetables",
        category: "Main Course",
        price: 829,
        isAvailable: true,
        isVegetarian: true,
      },
      {
        restaurant: restaurant5._id,
        name: "Fortune Cookies",
        description: "Classic fortune cookies (4 pieces)",
        category: "Desserts",
        price: 248,
        isAvailable: true,
        isVegetarian: true,
      },
    ]);

    // Create menu items for Mediterranean Delight
    await MenuItem.create([
      {
        restaurant: restaurant6._id,
        name: "Falafel Wrap",
        description: "Crispy falafel in pita with tahini sauce",
        category: "Main Course",
        price: 829,
        isAvailable: true,
        isVegetarian: true,
        isVegan: true,
      },
      {
        restaurant: restaurant6._id,
        name: "Chicken Shawarma",
        description: "Marinated chicken with garlic sauce",
        category: "Main Course",
        price: 1079,
        isAvailable: true,
      },
      {
        restaurant: restaurant6._id,
        name: "Hummus Plate",
        description: "Creamy hummus with pita and vegetables",
        category: "Starters",
        price: 663,
        isAvailable: true,
        isVegetarian: true,
        isVegan: true,
      },
      {
        restaurant: restaurant6._id,
        name: "Greek Salad",
        description: "Fresh tomatoes, cucumbers, olives, and feta",
        category: "Starters",
        price: 746,
        isAvailable: true,
        isVegetarian: true,
      },
      {
        restaurant: restaurant6._id,
        name: "Baklava",
        description: "Sweet pastry with honey and nuts",
        category: "Desserts",
        price: 414,
        isAvailable: true,
        isVegetarian: true,
      },
    ]);

    // Create menu items for Vegan Paradise
    await MenuItem.create([
      {
        restaurant: restaurant7._id,
        name: "Beyond Burger",
        description: "Plant-based burger with all the fixings",
        category: "Main Course",
        price: 1244,
        isAvailable: true,
        isVegetarian: true,
        isVegan: true,
        extras: [
          { name: "Vegan Cheese", price: 166 },
          { name: "Avocado", price: 208 },
        ],
      },
      {
        restaurant: restaurant7._id,
        name: "Quinoa Buddha Bowl",
        description: "Quinoa with roasted vegetables and tahini dressing",
        category: "Main Course",
        price: 995,
        isAvailable: true,
        isVegetarian: true,
        isVegan: true,
      },
      {
        restaurant: restaurant7._id,
        name: "Sweet Potato Fries",
        description: "Baked sweet potato fries with herb seasoning",
        category: "Starters",
        price: 580,
        isAvailable: true,
        isVegetarian: true,
        isVegan: true,
      },
      {
        restaurant: restaurant7._id,
        name: "Green Smoothie Bowl",
        description: "Blend of spinach, banana, and almond milk",
        category: "Breakfast",
        price: 746,
        isAvailable: true,
        isVegetarian: true,
        isVegan: true,
      },
      {
        restaurant: restaurant7._id,
        name: "Vegan Chocolate Cake",
        description: "Rich chocolate cake made with plant-based ingredients",
        category: "Desserts",
        price: 663,
        isAvailable: true,
        isVegetarian: true,
        isVegan: true,
      },
    ]);

    // Create menu items for Pasta Bella
    await MenuItem.create([
      {
        restaurant: restaurant8._id,
        name: "Spaghetti Carbonara",
        description: "Creamy pasta with pancetta and parmesan",
        category: "Main Course",
        price: 1409,
        isAvailable: true,
        extras: [
          { name: "Extra Parmesan", price: 166 },
          { name: "Garlic Bread", price: 291 },
        ],
      },
      {
        restaurant: restaurant8._id,
        name: "Margherita Pizza",
        description: "Wood-fired pizza with fresh mozzarella and basil",
        category: "Main Course",
        price: 1327,
        isAvailable: true,
        isVegetarian: true,
      },
      {
        restaurant: restaurant8._id,
        name: "Bruschetta",
        description: "Toasted bread with tomatoes, basil, and balsamic",
        category: "Starters",
        price: 746,
        isAvailable: true,
        isVegetarian: true,
      },
      {
        restaurant: restaurant8._id,
        name: "Tiramisu",
        description: "Classic Italian dessert with coffee and mascarpone",
        category: "Desserts",
        price: 663,
        isAvailable: true,
        isVegetarian: true,
      },
      {
        restaurant: restaurant8._id,
        name: "Limoncello",
        description: "Italian lemon liqueur",
        category: "Drinks",
        price: 746,
        isAvailable: true,
        isVegetarian: true,
      },
    ]);

    console.log("Created menu items");
    console.log("\n=== Sample Accounts ===");
    console.log("Customer: customer@test.com / password123");
    console.log("Restaurant Owner: owner@test.com / password123");
    console.log("Admin: admin@test.com / password123");
    console.log("\nDatabase seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

connectDB().then(seedData);
