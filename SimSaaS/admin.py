from django.contrib import admin
from .models import Event, League

from .models import Event, League, Profile
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User


# Register your models here.



class EventAdmin(admin.ModelAdmin):
    list_display = ('eventName','league', 'eventType', 'date', 'trackImage_On','trackImage_Off','jobOverviewFile' )
    fields = ['eventName', 'league', 'eventType', 'date', 'trackImage_On', 'trackImage_Off', 'jobOverviewFile']
    

# Register the Event class with the associated model
admin.site.register(Event, EventAdmin)



class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'profile'

class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline, )

admin.site.unregister(User)
admin.site.register(User, UserAdmin)


class EventsInLine(admin.TabularInline):
	model = Event
	extra = 0

class UsersInLine(admin.TabularInline):
	model = Profile
	extra = 0


class LeagueAdmin(admin.ModelAdmin):
    list_display = ('league_name',)
    fields = ['league_name',]
    inlines = [EventsInLine, UsersInLine]

# Register the Event class with the associated model
admin.site.register(League, LeagueAdmin)
