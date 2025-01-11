# Overview

The Queue Management App is a React-based application designed to facilitate the efficient management of players across multiple queues. Players can be distributed, processed, and reassigned between queues dynamically, making it an excellent tool for managing tournaments or similar events. The app also integrates with MongoDB for persistent storage, enabling easy updates and retrieval of player and queue data.

# Features

## Player Management

        Add players with details like names, categories, and phone numbers.
        Assign players to queues or mark them as unprocessed.
        Update player statuses dynamically (e.g., assignedToQueue, processedThroughQueue).

## Queue Management

        Create, update, and delete queues.
        Dynamically find and add players to the shortest queue.
        Redistribute items between queues while ensuring no duplicates.

## Drag and Drop

        Drag items from the unprocessed list to a queue.
        Rearrange items within queues.

## Persistent Storage

        Store players and queue data in MongoDB using Mongoose schemas.
        Handle CRUD operations for both players and queues.

## State Management

        Use React's useState and useReducer hooks to manage complex interactions.
        Context API for sharing state across components.

## Dynamic Updates

        Ensure queues are updated in real-time when players are added or reassigned.
        Prevent duplicates across queues and unprocessed lists.

# Core Data Structures

## Player Object

{
"\_id": "6747f3044eafd5b409c0ac96",
"id": 1,
"names": "Player 29 vs Player 117",
"categories": ["teens"],
"phoneNumbers": ["04840 329 948"],
"tournamentId": "674535149d28197b79a96bd1",
"assignedToQueue": false,
"processedThroughQueue": false
}

## Queue Object

{
"\_id": "674c31ae6481d1026a4f69b9",
"id": "q11",
"queueName": "Field 1",
"queueItems": []
}

# Key Components

## Player List

    Displays all players in the tournament.
    Differentiates between processed and unprocessed players.

## Queue

    Represents a single queue.
    Shows the items assigned to the queue.

## Drag-and-Drop Zone

    Provides an interactive UI for reordering and assigning players.

## Buttons

    Add All to Queues: Distributes players across queues.
    Remove All: Clears a queue or unprocessed list.

# Functions

## handleAddToShortestQueue

Assigns a player to the shortest queue by comparing the length of queueItems.
Parameters

    itemId (string | undefined): ID of the player to be added.

Process

    Finds the player by itemId.
    Identifies the shortest queue.
    Updates the queue's queueItems and marks the player as assigned.

Usage

Called when a player is manually added to a queue or distributed using a button.

## onDelete

Removes a player from the database and updates the state.
Parameters

    id (string): The MongoDB _id of the player to delete.

Usage

Used for clearing players no longer needed in the tournament.

## queueSlicer

Slices a collection of items from queues and redistributes them.
Returns

    stumps: Items to be redistributed.
    slicedCollection: Remaining items after extraction.

Usage

Called during batch redistribution or when queues need rebalancing.

# MongoDB Integration

## Database

Player Collection
Tournament Collection

# API Endpoints

## GET /api/players

    Retrieves all players.

## POST /api/players

    Adds a new player.

## DELETE /api/players/:id

    Deletes a player by ID.

## GET /api/queues

    Retrieves all queues.

# Seeding utilities | dev purposes

## npm run seed:tournaments

    Populates the db with 7 empty tournaments

## npm run seed:players

    Populates the db with players. Players are added into the players collection & to the corresponding tournament
