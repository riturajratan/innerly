// Editorial translations, not independently validated clinical versions.
const pack=(questions,frequency,options,timeframe,context,note,coverage,privacy,ui)=>({questions:questions.split('\n'),frequency:frequency.split('|'),options:options.map(s=>s.split('|')),timeframe,context,note,coverage,privacy,ui:ui.split('|')});
export default {
es:pack(`Sentirse nervioso, ansioso o al límite
No poder parar o controlar la preocupación
Sentirse decaído, deprimido o sin esperanza
Tener poco interés o placer en hacer cosas
¿Con qué frecuencia te ha resultado difícil manejar las exigencias cotidianas?
¿Con qué frecuencia dormir mal ha dificultado tu día?
Cuando sentiste enfado, ¿qué respuesta te describió con más frecuencia?
¿Cuánto han afectado estas dificultades al trabajo, al hogar o a las relaciones?
¿Qué parte de tu vida te ha pesado más últimamente?
¿En qué te gustaría recibir más apoyo?`,
`Nunca|Varios días|Más de la mitad de los días|Casi todos los días`,[
`Hice una pausa antes de responder|Me quedé en silencio o me aparté|Levanté la voz o reaccioné rápidamente|Varió / No sentí enfado`,
`Nada|Un poco|Bastante|Mucho`,
`Trabajo o negocio|Hogar o familia|Relaciones|Varias áreas / Ninguna en particular`,
`Reaccionar con más calma|Descanso y rutina|Hablar de lo que me pasa|Aún no lo sé`],
`Durante las últimas dos semanas, ¿con qué frecuencia te ha molestado el siguiente problema?`,
`Últimas dos semanas · Solo contexto; no forma parte de la puntuación de cribado.`,
`Traducción editorial, no validada de forma independiente en esta aplicación. No es un diagnóstico.`,
`Las 46 preguntas y sus opciones están en español. La página de inicio y el informe detallado están disponibles en inglés e hindi.`,
`Tus respuestas se guardarán solo en este navegador. Al volver, también se guardarán las nuevas respuestas. Otras personas que usen este navegador podrían leerlas. Usa un dispositivo privado. Puedes eliminar el borrador desde el inicio. No se sincroniza con otros dispositivos.`,
`completado|Prefiero no responder|Omitida · Puedes elegir una respuesta|Guardado en este navegador|No se pudo guardar. Mantén esta página abierta.|Mantén el mismo idioma en esta evaluación.|Guardar aquí y descansar|Eliminar borrador|Preguntas completadas|Tu pequeño recorrido`),
fr:pack(`Se sentir nerveux, anxieux ou à bout
Ne pas pouvoir arrêter ou contrôler ses inquiétudes
Se sentir abattu, déprimé ou sans espoir
Avoir peu d'intérêt ou de plaisir à faire des choses
À quelle fréquence les exigences du quotidien vous ont-elles semblé difficiles à gérer ?
À quelle fréquence un mauvais sommeil a-t-il rendu votre journée plus difficile ?
Lorsque vous étiez en colère, quelle réaction vous correspondait le plus souvent ?
Dans quelle mesure ces difficultés ont-elles affecté le travail, la maison ou vos relations ?
Quel domaine de votre vie vous a semblé le plus lourd récemment ?
Pour quoi souhaiteriez-vous le plus de soutien ?`,
`Jamais|Plusieurs jours|Plus de la moitié des jours|Presque tous les jours`,[
`J'ai fait une pause avant de répondre|Je me suis tu ou éloigné|J'ai haussé la voix ou réagi rapidement|Cela variait / Je n'ai pas ressenti de colère`,
`Pas du tout|Un peu|Assez|Beaucoup`,
`Travail ou activité professionnelle|Maison ou famille|Relations|Plusieurs domaines / Aucun en particulier`,
`Réagir plus calmement|Repos et habitudes|En parler|Je ne sais pas encore`],
`Au cours des deux dernières semaines, à quelle fréquence le problème suivant vous a-t-il dérangé ?`,
`Deux dernières semaines · Contexte uniquement, hors score de dépistage.`,
`Traduction éditoriale, sans validation indépendante dans cette application. Ce n'est pas un diagnostic.`,
`Les 46 questions et leurs réponses sont en français. L'accueil et le rapport détaillé sont disponibles en anglais et en hindi.`,
`Vos réponses seront conservées uniquement dans ce navigateur. À votre retour, les nouvelles réponses seront aussi enregistrées. Toute personne utilisant ce navigateur pourrait les lire. Utilisez un appareil privé. Vous pouvez supprimer le brouillon depuis l'accueil. Aucune synchronisation entre appareils.`,
`terminé|Je préfère ne pas répondre|Passée · Vous pouvez encore répondre|Enregistré dans ce navigateur|Échec de l'enregistrement. Gardez cette page ouverte.|Conservez la même langue pour cette évaluation.|Enregistrer ici et faire une pause|Supprimer le brouillon|Questions terminées|Votre petit parcours`),
de:pack(`Sich nervös, ängstlich oder angespannt fühlen
Sorgen nicht stoppen oder kontrollieren können
Sich niedergeschlagen, depressiv oder hoffnungslos fühlen
Wenig Interesse oder Freude an Tätigkeiten haben
Wie oft fiel es Ihnen schwer, alltägliche Anforderungen zu bewältigen?
Wie oft hat schlechter Schlaf Ihren Tag erschwert?
Welche Reaktion passte am häufigsten zu Ihnen, wenn Sie wütend waren?
Wie stark haben diese Schwierigkeiten Arbeit, Zuhause oder Beziehungen beeinträchtigt?
Welcher Lebensbereich hat Sie zuletzt am meisten belastet?
Wobei wünschen Sie sich am meisten Unterstützung?`,
`Überhaupt nicht|An einzelnen Tagen|An mehr als der Hälfte der Tage|Beinahe jeden Tag`,[
`Ich hielt vor der Antwort kurz inne|Ich wurde still oder ging auf Abstand|Ich wurde laut oder reagierte schnell|Es war unterschiedlich / Ich war nicht wütend`,
`Gar nicht|Ein wenig|Ziemlich|Sehr`,
`Arbeit oder Geschäft|Zuhause oder Familie|Beziehungen|Mehrere Bereiche / Keiner besonders`,
`Ruhiger reagieren|Erholung und Alltag|Darüber sprechen|Ich weiß es noch nicht`],
`Wie oft fühlten Sie sich in den letzten zwei Wochen durch das folgende Problem beeinträchtigt?`,
`Letzte zwei Wochen · Nur Kontext, kein Bestandteil des Screeningwerts.`,
`Redaktionelle Übersetzung, in dieser App nicht unabhängig validiert. Keine Diagnose.`,
`Alle 46 Fragen und Antwortmöglichkeiten sind auf Deutsch. Startseite und ausführlicher Bericht sind auf Englisch und Hindi verfügbar.`,
`Ihre Antworten werden nur in diesem Browser gespeichert. Nach Ihrer Rückkehr werden auch neue Antworten gespeichert. Andere Personen, die diesen Browser nutzen, könnten sie lesen. Verwenden Sie ein privates Gerät. Der Entwurf kann auf der Startseite entfernt werden. Keine geräteübergreifende Synchronisierung.`,
`abgeschlossen|Ich möchte nicht antworten|Übersprungen · Sie können noch antworten|In diesem Browser gespeichert|Speichern fehlgeschlagen. Lassen Sie diese Seite geöffnet.|Bleiben Sie für diesen Check-in bei einer Sprache.|Hier speichern und pausieren|Entwurf entfernen|Beantwortete Fragen|Ihr kleiner Weg`),
pt:pack(`Sentir-se nervoso, ansioso ou muito tenso
Não conseguir parar ou controlar a preocupação
Sentir-se desanimado, deprimido ou sem esperança
Ter pouco interesse ou prazer em fazer as coisas
Com que frequência foi difícil lidar com as exigências do dia a dia?
Com que frequência dormir mal tornou seu dia mais difícil?
Quando sentiu raiva, qual reação mais descreveu você?
Quanto essas dificuldades afetaram o trabalho, a casa ou os relacionamentos?
Qual parte da sua vida pareceu mais pesada ultimamente?
Em que você mais gostaria de receber apoio?`,
`Nenhuma vez|Vários dias|Mais da metade dos dias|Quase todos os dias`,[
`Fiz uma pausa antes de responder|Fiquei em silêncio ou me afastei|Levantei a voz ou reagi rapidamente|Variou / Não senti raiva`,
`Nada|Um pouco|Bastante|Muito`,
`Trabalho ou negócio|Casa ou família|Relacionamentos|Várias áreas / Nenhuma em particular`,
`Reagir com mais calma|Descanso e rotina|Conversar sobre o que acontece|Ainda não sei`],
`Nas últimas duas semanas, com que frequência o seguinte problema incomodou você?`,
`Últimas duas semanas · Apenas contexto; não entra na pontuação de triagem.`,
`Tradução editorial, sem validação independente neste aplicativo. Não é um diagnóstico.`,
`As 46 perguntas e opções estão em português. A página inicial e o relatório detalhado estão disponíveis em inglês e hindi.`,
`Suas respostas ficarão apenas neste navegador. Ao voltar, novas respostas também serão salvas. Outras pessoas que usam este navegador poderão lê-las. Use um dispositivo privado. Você pode remover o rascunho na página inicial. Não há sincronização entre dispositivos.`,
`concluído|Prefiro não responder|Ignorada · Você ainda pode responder|Salvo neste navegador|Não foi possível salvar. Mantenha esta página aberta.|Mantenha o mesmo idioma nesta avaliação.|Salvar aqui e descansar|Remover rascunho|Perguntas concluídas|Seu pequeno percurso`),
it:pack(`Sentirsi nervosi, ansiosi o molto tesi
Non riuscire a fermare o controllare le preoccupazioni
Sentirsi giù, depressi o senza speranza
Avere poco interesse o piacere nel fare le cose
Quanto spesso è stato difficile gestire le richieste quotidiane?
Quanto spesso dormire male ha reso più difficile la giornata?
Quando hai provato rabbia, quale reazione ti ha descritto più spesso?
Quanto hanno influito queste difficoltà sul lavoro, sulla casa o sulle relazioni?
Quale parte della tua vita ti è sembrata più pesante ultimamente?
Per cosa vorresti maggiormente ricevere sostegno?`,
`Mai|Diversi giorni|Più della metà dei giorni|Quasi ogni giorno`,[
`Ho fatto una pausa prima di rispondere|Sono rimasto in silenzio o mi sono allontanato|Ho alzato la voce o reagito rapidamente|È variato / Non ho provato rabbia`,
`Per niente|Un po'|Abbastanza|Molto`,
`Lavoro o attività|Casa o famiglia|Relazioni|Più aree / Nessuna in particolare`,
`Reagire con più calma|Riposo e abitudini|Parlarne|Non lo so ancora`],
`Nelle ultime due settimane, quanto spesso il seguente problema ti ha dato fastidio?`,
`Ultime due settimane · Solo contesto, escluso dal punteggio di screening.`,
`Traduzione editoriale, non validata in modo indipendente in questa app. Non è una diagnosi.`,
`Le 46 domande e le opzioni sono in italiano. La pagina iniziale e il rapporto dettagliato sono disponibili in inglese e hindi.`,
`Le risposte resteranno solo in questo browser. Al ritorno, saranno salvate anche le nuove risposte. Altre persone che usano questo browser potrebbero leggerle. Usa un dispositivo privato. Puoi rimuovere la bozza dalla pagina iniziale. Nessuna sincronizzazione tra dispositivi.`,
`completato|Preferisco non rispondere|Saltata · Puoi ancora rispondere|Salvato in questo browser|Salvataggio non riuscito. Tieni aperta questa pagina.|Mantieni la stessa lingua per questo questionario.|Salva qui e fai una pausa|Rimuovi bozza|Domande completate|Il tuo piccolo percorso`),
ru:pack(`Чувство нервозности, тревоги или сильного напряжения
Невозможность остановить или контролировать беспокойство
Чувство подавленности, угнетённости или безнадёжности
Мало интереса или удовольствия от занятий
Как часто вам было трудно справляться с повседневными делами?
Как часто плохой сон осложнял ваш день?
Когда вы злились, какая реакция чаще всего вас описывала?
Насколько эти трудности повлияли на работу, домашнюю жизнь или отношения?
Какая область жизни в последнее время давалась тяжелее всего?
В чём вам больше всего хотелось бы получить поддержку?`,
`Ни разу|Несколько дней|Более половины дней|Почти каждый день`,[
`Я делал паузу перед ответом|Я замолкал или отходил в сторону|Я повышал голос или реагировал сразу|По-разному / Я не испытывал злости`,
`Совсем не повлияли|Немного|Довольно сильно|Очень сильно`,
`Работа или бизнес|Дом или семья|Отношения|Несколько областей / Ничего конкретного`,
`Реагировать спокойнее|Отдых и распорядок|Обсудить происходящее|Я пока не знаю`],
`Как часто за последние две недели вас беспокоила следующая проблема?`,
`Последние две недели · Только контекст, не входит в балл скрининга.`,
`Редакционный перевод, не прошедший независимую проверку в этом приложении. Это не диагноз.`,
`Все 46 вопросов и варианты ответов доступны на русском. Главная страница и подробный отчёт доступны на английском и хинди.`,
`Ответы сохранятся только в этом браузере. После возвращения новые ответы тоже будут сохраняться. Другие пользователи этого браузера могут их прочитать. Используйте личное устройство. Удалить черновик можно на главной странице. Синхронизации между устройствами нет.`,
`завершено|Предпочитаю не отвечать|Пропущено · Можно ответить позже|Сохранено в этом браузере|Не удалось сохранить. Оставьте страницу открытой.|Сохраняйте один язык в течение этого опроса.|Сохранить здесь и отдохнуть|Удалить черновик|Отвечено на вопросы|Ваш небольшой путь`),
tr:pack(`Kendini gergin, kaygılı veya diken üstünde hissetmek
Endişelenmeyi durduramamak veya kontrol edememek
Kendini çökkün, depresif veya umutsuz hissetmek
Bir şeyler yapmaya az ilgi duymak veya az keyif almak
Günlük taleplerle başa çıkmak ne sıklıkla zor geldi?
Kötü uyku gününüzü ne sıklıkla zorlaştırdı?
Öfkelendiğinizde sizi en sık hangi tepki tanımladı?
Bu zorluklar işinizi, ev yaşamınızı veya ilişkilerinizi ne kadar etkiledi?
Son zamanlarda hayatınızın hangi alanı en ağır geldi?
En çok hangi konuda destek almak istersiniz?`,
`Hiç|Birkaç gün|Günlerin yarısından fazlasında|Neredeyse her gün`,[
`Yanıt vermeden önce durakladım|Sessiz kaldım veya uzaklaştım|Sesimi yükselttim veya hemen tepki verdim|Değişkendi / Öfkelenmedim`,
`Hiç|Biraz|Oldukça|Çok`,
`İş veya işletme|Ev veya aile|İlişkiler|Birden fazla alan / Belirli bir alan yok`,
`Daha sakin tepkiler|Dinlenme ve düzen|Konuşup anlamlandırmak|Henüz emin değilim`],
`Son iki hafta içinde aşağıdaki sorun sizi ne sıklıkla rahatsız etti?`,
`Son iki hafta · Yalnızca bağlam; tarama puanına dahil değildir.`,
`Bu uygulamada bağımsız olarak doğrulanmamış editoryal çeviri. Tanı değildir.`,
`46 soru ve yanıt seçenekleri Türkçedir. Ana sayfa ve ayrıntılı rapor İngilizce ve Hintçe sunulur.`,
`Yanıtlarınız yalnızca bu tarayıcıda kalır. Döndüğünüzde yeni yanıtlar da kaydedilir. Bu tarayıcıyı kullanan başkaları bunları okuyabilir. Özel bir cihaz kullanın. Taslağı ana sayfadan kaldırabilirsiniz. Cihazlar arasında eşitleme yapılmaz.`,
`tamamlandı|Yanıtlamak istemiyorum|Atlandı · Hâlâ yanıt verebilirsiniz|Bu tarayıcıya kaydedildi|Kaydedilemedi. Bu sayfayı açık tutun.|Bu değerlendirme boyunca aynı dili kullanın.|Buraya kaydet ve ara ver|Taslağı kaldır|Tamamlanan sorular|Küçük yolculuğunuz`)
};
