# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-19 19:57
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SimSaaS', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='event',
            name='trackImage',
        ),
        migrations.AddField(
            model_name='event',
            name='trackImage_Off',
            field=models.FileField(default='settings.MEDIA_ROOT/trackImages/AddPlot_hover.png', upload_to='trackImages/'),
        ),
        migrations.AddField(
            model_name='event',
            name='trackImage_On',
            field=models.FileField(default='settings.MEDIA_ROOT/trackImages/AddPlot_hover.png', upload_to='trackImages/'),
        ),
    ]
