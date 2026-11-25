# Diagramme de classes — Kiroku

Le diagramme présente le catalogue, les listes, les notes et les commandes du schéma Prisma. La bibliothèque est calculée à partir des lignes des commandes payées du membre.

```mermaid
classDiagram
    class User {
        String userId
        String clerkId
        String username
        Role role
    }
    class Media {
        String mediaId
        Int anilistId
        String title
    }
    class MediaList {
        String mediaListId
        String name
        Boolean isPublic
    }
    class MediaListItem {
        String mediaListItemId
    }
    class Review {
        String reviewId
        Float rating
    }
    class Product {
        String productId
        String name
        EditionType editionType
        Int editionNumber
        Int priceCents
    }
    class EditionType {
        <<enumeration>>
        MANGA_VOLUME
        ANIME_EPISODE
    }
    class Order {
        String orderId
        OrderStatus status
        String currency
        Int subtotalCents
        Int gstCents
        Int qstCents
        Int totalCents
        String stripeCheckoutSessionId
        String stripePaymentIntentId
        DateTime createdAt
        DateTime paidAt
    }
    class OrderStatus {
        <<enumeration>>
        PENDING
        PAID
        EXPIRED
        REFUNDED
    }
    class OrderItem {
        String orderItemId
        String productName
        Int unitPriceCents
    }
    class Refund {
        String refundId
        String stripeRefundId
        Int amountCents
        DateTime refundedAt
    }
    class WebhookEvent {
        String id
        String type
        DateTime processedAt
    }

    User "1" -- "0..*" MediaList : possède
    MediaList "1" -- "0..*" MediaListItem : contient
    Media "1" -- "0..*" MediaListItem : figure dans
    User "1" -- "0..*" Review : rédige
    Media "1" -- "0..*" Review : reçoit
    Media "1" -- "0..*" Product : éditions
    User "1" -- "0..*" Order : passe
    Order "1" -- "1..*" OrderItem : contient
    Product "1" -- "0..*" OrderItem : correspond à
    Order "1" -- "0..1" Refund : remboursement intégral
    Product ..> EditionType : utilise
    Order ..> OrderStatus : utilise
    WebhookEvent ..> Order : traite un changement
```
