# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-20 20:38
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SimSaaS', '0004_event_joboverview'),
    ]

    operations = [
        migrations.RenameField(
            model_name='event',
            old_name='jobOverview',
            new_name='jobOverviewFile',
        ),
    ]