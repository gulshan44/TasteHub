# TasteHub Architecture

## Overview

TasteHub is a multi-tenant SaaS-based Restaurant Operating System.

## Core Architecture

The platform is designed around restaurants as tenants.

Each restaurant owns and manages its operational data independently.

## Core Entities

- User
- Restaurant
- Membership
- Category
- MenuItem
- Table
- Customer
- Order
- OrderItem

## User and Restaurant Relationship

Users are connected to restaurants through Memberships.

A user can belong to multiple restaurants with different roles.

## Roles

- SUPER_ADMIN
- OWNER
- MANAGER
- STAFF
- KITCHEN

## Tenant Isolation

All restaurant-owned resources must contain a restaurant reference.

Restaurant-specific queries must always be scoped to the authenticated restaurant.

## Core Relationships

User
→ Membership
→ Restaurant

Restaurant
→ Categories
→ MenuItems
→ Tables
→ Customers
→ Orders

Order
→ OrderItems