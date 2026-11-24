# Diagramme de classes — Kiroku

Les classes de catalogue, de listes et de notes proviennent du schéma actuel. Les classes de commande décrivent le modèle cible du laboratoire. La bibliothèque est calculée à partir des lignes des commandes payées du membre.

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
        Int priceCents
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
    Order ..> OrderStatus : utilise
    WebhookEvent ..> Order : traite un changement
```
