from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.

class Event(models.Model):
    """
    Model representing an event (e.g.: F3's first hockenheim race)
    """
    eventName = models.CharField(max_length=200)
    RACE = 'R'
    TEST = 'T'
    EVENT_CHOICES = (
        (RACE, 'Race'),
        (TEST, 'Test'),        
    )
    eventType = models.CharField(
        max_length=1,
        choices=EVENT_CHOICES,
        default=RACE,
    )
    date = models.DateField(null=True, blank=True)
    # trackImage_On= models.FileField(upload_to='trackImages/',default='settings.MEDIA_ROOT/trackImages/AddPlot_hover.png')
    # trackImage_Off = models.FileField(upload_to='trackImages/',default='settings.MEDIA_ROOT/trackImages/AddPlot_hover.png')

    trackImage_On= models.FileField(upload_to='trackImages/',default='trackImages/AddPlot_hover.png')
    trackImage_Off = models.FileField(upload_to='trackImages/',default='trackImages/AddPlot_hover.png')


    league = models.ForeignKey('League', on_delete=models.SET_NULL, null=True)
    # Foreign Key used because Event can only have one league, but leagues can have multiple events

    
    class Meta:
        ordering = ["date"]
    
    def __str__(self):
        """
        String for representing the Model object.
        """
        return self.eventName
    
    
    def get_absolute_url(self):
        """
        Returns the url to access a particular event instance.
        """
        return reverse('event-detail', args=[str(self.id)])



class League(models.Model):
    """
    Model representing a League.(e.g. F4)
    """
    league_name = models.CharField(max_length=100)
    # league_user = models.ForeignKey('League', on_delete=models.SET_NULL, null=True)

        
    def get_absolute_url(self):
        """
        Returns the url to access a particular author instance.
        """
        return reverse('league-detail', args=[str(self.id)])
    

    def __str__(self):
        """
        String for representing the Model object.
        """
        return self.league_name

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    league = models.ForeignKey('League', on_delete=models.SET_NULL, null=True)
 


