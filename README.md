# Omniglot: what is it?

Omniglot is a low-code full-stack state management solution that:
- is driven by a declarative data model which represents the application in semantic terms
- is cloud-agnostic, storage-agnostic, and front-end agnostic 
- provides app services in a Backend-as-a-Service format
- securely enforces business logic and access controls in app services
- supports fine-grained access controls tied to business-logic actions
- supports development of scalable and secure cloud analytic processes for push notifications, search, and AI

The Omniglot source code is partitioned into a number of NPM projects each available
as a separate package on `npmjs.com` and with source stored in separate github repositories.

This repo contains the Omniglot _Domains_Library_, a collection of pure Typescript definitions
(interfaces, classes, enumerations mostly) which implement reusable semantic datatypes in a
format-indepent manner. Each semantic type has an internal data representation which is 
an minimally opinionated, maximally factored "comprehensive" representation serving as a neutral
design point between varying opinionated datatype formats. 

Translation between the comprehensive representation and the following are usually provided:
- one or more common native Javascript/Typescript formats
- string representation formats
- pure JSON format
