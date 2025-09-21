+++
date = '2025-09-21T16:33:19+04:00'
draft = true
title = 'THE FALL OF THE HOUSE OF VULKAN'
readTime = true
toc = true
math = true
tags = ['software', 'computer-graphics']
showTags = true
autoNumber = true
+++

*During the whole of a dull, dark, and soundless day in the autumn of the year,
when the clouds hung oppressively low in the heavens, I had been programming
alone, on a laptop, a singularly dreary project; and at length found myself,
as the shades of the evening drew on, within view of the interpolated
triangle. I know not how it was, but, with the first glimpse of the API, a
sense of insufferable doom pervaded my spirit.*

<!--more-->

## Prologue

Take a look at this image:

![3D render of the Utah teapot](/utah_teapot.png "By Dhatfield, CC BY-SA 3.0")

What is it? Well, it's a teapot. Is it real? Of course not. This teapot was
*inspired* by a real teapot:

![Original Utah teapot](/original_teapot.jpg "By Marshall Astor, CC BY-SA 2.0")

The one above is *real*, but the one before isn't. It's an imitation, an
artificial reproduction, a simulacrum, and a convincing one at that. Does it
matter that it is isn't real? What is the difference between the real and the fake?
I'm not here to discuss
[philosophy](https://en.wikipedia.org/wiki/Simulacra_and_Simulation). No, I'm
here to tell you something more important:

**You have been scammed.**

A multi-trillion-dollar industry has convinced you that you need to pay
thousands of dollars to create your own simulacra. And that you also need to
write a [thousand lines](https://github.com/SaschaWillems/Vulkan/blob/master/examples/triangle/triangle.cpp) of code just to see a single triangle. I am here to tell
you that there's another way. That you can do all that by yourself.

![A conspiracy](/gpconspiracy.png "By Funny_Possible5155 on reddit")

## Prerequisites

I will take you on a journey so that by the end of it, you will be able to
generate your own images like those of the Utah teapot---no GPUs required. But,
I am not going to teach you *everything*, so you need to have some base
knowledge before you can continue. Below is the list of things that you need to
be at least familiar with (I don't earn money from the referral links):

- C programming language [[book link]](https://www.amazon.com/Programming-Language-2nd-Brian-Kernighan/dp/0131103628)
- Linear algebra and trigonometry [[pdf link]](https://www.realtimerendering.com/Real-Time_Rendering_4th-Appendices.pdf)
- Linux basics [[book link]](https://www.amazon.com/Linux-Command-Line-2nd-Introduction/dp/1593279523)
