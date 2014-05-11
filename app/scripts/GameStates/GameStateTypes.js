'use strict';

namespace('Soi.GameStates');

Soi.GameStates.GameStateTypes = {
  'Bootloader': {
    'name': 'boot',
    'type': Soi.GameStates.BootloaderGameState,
    'autoStart': true
  },
  'Preloader': {
    'name': 'preloader',
    'type': Soi.GameStates.PreloaderGameState,
    'autoStart': false
  },
  'Menu': {
    'name': 'menu',
    'type': Soi.GameStates.MenuGameState,
    'autoStart': false
  },
  'Gameplay': {
    'name': 'gameplay',
    'type': Soi.GameStates.GameplayGameState,
    'autoStart': false
  }
  // ,
  // 'Credits': {
  //   'name': 'credits',
  //   'type': Soi.GameStates.CreditsGameState,
  //   'autoStart': false
  // }
};