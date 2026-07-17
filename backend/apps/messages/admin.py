from django.contrib import admin
from .models import MessageThread, Message

@admin.register(MessageThread)
class ThreadAdmin(admin.ModelAdmin):
    list_display = ["upwork_room_id","unread_count","last_synced_at"]

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display  = ["sender_name","sent_at","thread"]
    search_fields = ["body","sender_name"]
