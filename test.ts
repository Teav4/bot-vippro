import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

prisma.avatar.createMany({
  data: [
    {
      label: 'Akane',
      url: 'https://static.miraheze.org/bluearchivewiki/thumb/9/99/Akane_%28Bunny_Girl%29.png/266px-Akane_%28Bunny_Girl%29.png'
    },
    {
      label: 'Arisu',
      url: 'https://static.miraheze.org/bluearchivewiki/thumb/0/0f/Arisu.png/266px-Arisu.png'
    },
    {
      label: 'Azusa',
      url: 'https://static.miraheze.org/bluearchivewiki/thumb/a/a4/Azusa_%28Swimsuit%29.png/266px-Azusa_%28Swimsuit%29.png'
    },
    {
      label: 'Cherino',
      url: 'https://static.miraheze.org/bluearchivewiki/thumb/7/7c/Cherino.png/266px-Cherino.png'
    },
    {
      label: 'Cherino2',
      url: 'https://static.miraheze.org/bluearchivewiki/thumb/9/95/Cherino_%28Hot_Spring%29.png/266px-Cherino_%28Hot_Spring%29.png'
    },
    {
      label: 'Chise',
      url: 'https://static.miraheze.org/bluearchivewiki/thumb/1/1e/Chise_%28Swimsuit%29.png/266px-Chise_%28Swimsuit%29.png'
    },
    {
      label: 'Miku',
      url: 'https://static.miraheze.org/bluearchivewiki/thumb/9/93/Hatsune_Miku.png/266px-Hatsune_Miku.png'
    },
    {
      label: 'Hifumi',
      url: 'https://static.miraheze.org/bluearchivewiki/thumb/3/3b/Hifumi.png/266px-Hifumi.png'
    },
  ]
}).then()
