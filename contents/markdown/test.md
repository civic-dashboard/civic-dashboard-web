# File 1 - will appear first
@"
---
title: Introduction
order: 1
---

# Introduction

Welcome to our documentation! This appears first.
"@ | Out-File -FilePath contents\markdown\intro.md -Encoding utf8

# File 2 - will appear second
@"
---
title: Getting Started
order: 2
---

# Getting Started

Here's how to get started with the platform.
"@ | Out-File -FilePath contents\markdown\getting-started.md -Encoding utf8

# File 3 - will appear third
@"
---
title: FAQ
order: 3
---

# Frequently Asked Questions

Common questions and answers.
"@ | Out-File -FilePath contents\markdown\faq.md -Encoding utf8