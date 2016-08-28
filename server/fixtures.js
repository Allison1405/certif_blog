// Données de préinstallation 
if (Posts.find().count() === 0) {
  var now = new Date().getTime();

  // Créer deux utilisateurs
  var adminId = Meteor.users.insert({
    profile: { 
      name: 'admin', 
      password: 'admin',
    }
  });
  var admin = Meteor.users.findOne(adminId);
  var manuId = Meteor.users.insert({
    profile: { 
      name: 'Manu Corbeau',
      password: 'azerty',
    }
  });
  var manu = Meteor.users.findOne(manuId);

  for (var i = 0; i < 10; i++) {
    Posts.insert({
      title: 'Test post #' + i,
      resume: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris posuere odio urna, id posuere nunc lobortis quis. Quisque nec porttitor est, sit amet sagittis elit. Mauris ex ex, condimentum vitae ipsum nec, rhoncus facilisis quam. Maecenas vulputate iaculis tortor et commodo. Morbi sollicitudin erat eget malesuada pretium. Aenean eget ex ultrices, ornare ligula id, egestas ipsum. Suspendisse eu tellus ornare, tincidunt augue venenatis, ullamcorper justo.',
      fullText:'#Un super titre\n##Un super sous-titre\nDu texte du texte du texte du texte du texte du texte du texte',
      author: manu.profile.name,
      userId: manu._id,
      url: 'http://google.com/?q=test-' + i,
      submitted: now - i * 3600 * 1000,
      commentsCount: 0,
      upvoters: [], votes: i
    });
  }

  var sciProdViewerId = Posts.insert({
    title: 'Scientific Productions Viewer',
    resume: 'A system that delivers a pretty view on all the scientific production of french research unit Épidémiologie animale.',
    fullText:'#Un super titre\n##Un super sous-titre\nDu texte du texte du texte du texte du texte du texte du texte',
    userId: manu._id,
    author: manu.profile.name,
    url: 'http://www6.clermont.inra.fr/epidemiologie-animale/Production-scientifique',
    submitted: now,
    commentsCount: 1,
    upvoters: [], votes: 20
  });

  Comments.insert({
    postId: sciProdViewerId,
    userId: manu._id,
    author: manu.profile.name,
    submitted: now - 3 * 3600 * 1000,
    body: 'A default comment.'
  });

  var epigelId = Posts.insert({
    title: 'TRAÇABILITÉ DES ÉCHANTILLONS DE LABORATOIRE : DÉVELOPPEMENT DU SYSTEME EPIGEL',
    resume: 'La traçabilité des échantillons de laboratoire est un des facteurs qui participe à l’organisation et au bon déroulement d’un plan d’expérimentation. Dans le cadre de la mise en place de sa démarche qualité, l’Unité d’Épidémiologie Animale (UR346 – Département Santé Animale) a initiée le développement d’EpiGEL, une application permettant la gestion de ses échantillons biologiques. S’appuyant sur le référentiel d’assurance qualité de l’INRA, cette application permet la traçabilité du cycle de vie des échantillons (recensement, localisation, transformation, aliquotage, expédition, épuisement, etc.), de recenser les données de sécurité associées à ces échantillons (pathogénicité) et leurs conditions d’élimination (durée de stockage). Nous décrivons le contexte, le processus de développement et les conditions de mise en production de cette application.',
    fullText:'#Un super titre\n##Un super sous-titre\nDu texte du texte du texte du texte du texte du texte du texte',
    userId: manu._id,
    author: manu.profile.name,
    url: 'http://www6.clermont.inra.fr/epidemiologie-animale/Production-scientifique',
    submitted: now,
    commentsCount: 1,
    upvoters: [], votes: 100
  });

  Comments.insert({
    postId: epigelId,
    userId: manu._id,
    author: manu.profile.name,
    submitted: now - 3 * 3600 * 1000,
    body: 'A default comment.'
  });
}